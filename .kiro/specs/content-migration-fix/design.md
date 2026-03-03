# Content Migration Fix - Bugfix Design

## Overview

The migrate-to-redis.js script currently provides minimal visibility when migrating page content from JSON files to Redis/Vercel KV storage. This fix enhances the script to provide detailed page-by-page migration reporting and verification, ensuring users can confirm that critical pages (Terms, Privacy, FAQ, About, Services, Home) are successfully migrated. The fix adds granular logging for object-based data structures while preserving existing behavior for array-based data (projects, news) and error handling.

## Glossary

- **Bug_Condition (C)**: The condition that triggers inadequate reporting - when migrating pages.json (object-based data with nested page objects)
- **Property (P)**: The desired behavior for pages.json migration - detailed per-page reporting with content indicators and verification
- **Preservation**: Existing migration behavior for projects.json, news.json, settings.json, and all error handling must remain unchanged
- **migrateToRedis**: The main async function in `scripts/migrate-to-redis.js` that handles data migration from JSON files to Redis
- **pages.json**: Object-based data structure where keys are page names (home, about, services, faq, terms, privacy) and values are page content objects
- **Object-based data**: Data structures where the root is an object with named keys (pages.json, settings.json) as opposed to arrays (projects.json, news.json)

## Bug Details

### Fault Condition

The bug manifests when migrating pages.json to Redis. The script currently only displays a generic message showing the count of object keys without revealing which specific pages are being migrated, whether they contain content, or if the migration succeeded for each individual page.

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input of type { filename: string, data: object }
  OUTPUT: boolean
  
  RETURN input.filename == 'pages.json'
         AND typeof input.data == 'object'
         AND NOT Array.isArray(input.data)
         AND Object.keys(input.data).length > 0
         AND currentLoggingBehavior == 'generic key count only'
END FUNCTION
```

### Examples

- **Current behavior for pages.json**: "✅ Migrated pages.json to Redis (key: pages)" followed by "→ 6 keys" - user cannot see which pages (home, about, services, faq, terms, privacy) were migrated
- **Expected behavior for pages.json**: Detailed list showing each page name, content indicators (e.g., "has 4 hero buttons", "1,234 chars"), and verification status
- **Current behavior for projects.json**: "✅ Migrated projects.json to Redis (key: projects)" followed by "→ 5 items" - this is acceptable for array data and should be preserved
- **Edge case - empty page object**: If a page exists but has no content fields, the system should report this clearly (e.g., "about: empty")

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Migration of projects.json and news.json must continue to display item counts as it currently does
- Migration of settings.json must continue to work with its current logging format
- Redis connection error handling must remain unchanged ("❌ REDIS_URL not found in .env.local")
- File not found handling must remain unchanged ("⚠️ Skipping {filename} (file not found)")
- Overall migration success message must remain unchanged ("🎉 Migration complete!")

**Scope:**
All inputs that do NOT involve pages.json migration should be completely unaffected by this fix. This includes:
- Array-based data migration (projects.json, news.json)
- Settings.json migration
- Error handling for missing files or Redis connection failures
- The overall migration flow and Redis connection/disconnection logic

## Hypothesized Root Cause

Based on the bug description and code analysis, the most likely issues are:

1. **Generic Object Handling**: The script treats all object-based data (pages.json, settings.json) the same way, using `Object.keys(data).length` without inspecting the structure or content of individual keys

2. **No Content Inspection**: The current code does not examine the values associated with each key in pages.json to determine if they contain meaningful content (text, images, buttons, etc.)

3. **Missing Verification Step**: After writing to Redis with `await redis.set(key, JSON.stringify(data))`, the script does not read back the data to verify successful storage

4. **Insufficient Logging Granularity**: The preview logic only handles two cases (arrays and objects) without special handling for nested object structures like pages.json where each key represents a distinct entity

## Correctness Properties

Property 1: Fault Condition - Detailed Page Migration Reporting

_For any_ migration operation where pages.json is being migrated to Redis, the enhanced script SHALL display a detailed breakdown of each page (home, about, services, faq, terms, privacy) with content indicators (such as character count, presence of hero buttons, or last updated timestamp) and SHALL verify that each page's content was successfully written to Redis by reading it back and confirming the data matches.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4**

Property 2: Preservation - Non-Pages Migration Behavior

_For any_ migration operation that is NOT pages.json (projects.json, news.json, settings.json), the enhanced script SHALL produce exactly the same logging output and behavior as the original script, preserving the current item count display for arrays and key count display for other objects, and maintaining all existing error handling behavior.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4**

## Fix Implementation

### Changes Required

Assuming our root cause analysis is correct:

**File**: `scripts/migrate-to-redis.js`

**Function**: `migrateToRedis` (main async function)

**Specific Changes**:

1. **Add Page-Specific Detection**: After reading the file data, check if `filename === 'pages.json'` to trigger enhanced logging

2. **Implement Detailed Page Logging**: For pages.json, iterate through each page key and log:
   - Page name (home, about, services, faq, terms, privacy)
   - Content indicators (e.g., character count of content field, number of hero buttons, presence of lastUpdated timestamp)
   - Visual indicators (✓ for pages with content, ⚠️ for empty pages)

3. **Add Verification Step**: After `redis.set()` for pages.json, perform `redis.get()` to read back the data and verify:
   - Data was successfully stored
   - All page keys are present in the retrieved data
   - Log verification status for each page

4. **Preserve Existing Behavior**: Ensure the enhanced logging only applies to pages.json, leaving projects.json, news.json, and settings.json unchanged

5. **Error Handling Enhancement**: If verification fails for any page, log a clear error message indicating which page failed and why (e.g., "❌ Verification failed for 'terms': data mismatch")

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the inadequate reporting on unfixed code, then verify the fix provides detailed reporting and preserves existing behavior for other data files.

### Exploratory Fault Condition Checking

**Goal**: Surface counterexamples that demonstrate the inadequate reporting BEFORE implementing the fix. Confirm that the current script provides insufficient visibility for pages.json migration.

**Test Plan**: Run the unfixed migrate-to-redis.js script with a populated pages.json file and observe the console output. Document the lack of per-page details and verification.

**Test Cases**:
1. **Pages.json Migration Test**: Run migration with pages.json containing all 6 pages (home, about, services, faq, terms, privacy) - observe only "→ 6 keys" is displayed (will demonstrate inadequate reporting on unfixed code)
2. **Empty Page Test**: Add an empty page object to pages.json - observe no warning about empty content (will demonstrate lack of content inspection on unfixed code)
3. **Verification Test**: After migration, manually check Redis to see if data matches - observe script provides no automatic verification (will demonstrate missing verification on unfixed code)
4. **Projects.json Comparison**: Run migration with projects.json - observe it shows "→ X items" which is acceptable for arrays (will serve as baseline for preservation)

**Expected Counterexamples**:
- Console output shows only "✅ Migrated pages.json to Redis (key: pages)" and "→ 6 keys" without page names
- No indication of which pages have content vs. which are empty
- No verification that data was successfully written to Redis
- Possible causes: generic object handling, no content inspection, missing verification step

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds (pages.json migration), the fixed script produces detailed reporting and verification.

**Pseudocode:**
```
FOR ALL input WHERE isBugCondition(input) DO
  result := migrateToRedis_fixed(input)
  ASSERT result.output CONTAINS each page name (home, about, services, faq, terms, privacy)
  ASSERT result.output CONTAINS content indicators for each page
  ASSERT result.verification == 'success' FOR ALL pages
  ASSERT result.output CONTAINS verification status messages
END FOR
```

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold (projects.json, news.json, settings.json), the fixed script produces the same result as the original script.

**Pseudocode:**
```
FOR ALL input WHERE NOT isBugCondition(input) DO
  ASSERT migrateToRedis_original(input).output = migrateToRedis_fixed(input).output
  ASSERT migrateToRedis_original(input).redisData = migrateToRedis_fixed(input).redisData
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across different data structures
- It catches edge cases that manual unit tests might miss (e.g., empty arrays, null values, special characters)
- It provides strong guarantees that behavior is unchanged for all non-pages.json files

**Test Plan**: Observe behavior on UNFIXED code first for projects.json, news.json, and settings.json migrations, then write property-based tests capturing that exact console output and Redis data.

**Test Cases**:
1. **Projects.json Preservation**: Observe that projects.json migration shows "→ X items" on unfixed code, then verify this exact format continues after fix
2. **News.json Preservation**: Observe that news.json migration shows "→ X items" on unfixed code, then verify this exact format continues after fix
3. **Settings.json Preservation**: Observe that settings.json migration shows "→ X keys" on unfixed code, then verify this exact format continues after fix
4. **Error Handling Preservation**: Observe that missing REDIS_URL shows "❌ REDIS_URL not found in .env.local" on unfixed code, then verify this exact error message continues after fix

### Unit Tests

- Test page content indicator extraction (character count, hero buttons count, lastUpdated presence)
- Test verification logic (reading back from Redis and comparing data)
- Test edge cases (empty page objects, missing content fields, pages with only some fields populated)
- Test that non-pages.json files skip the enhanced logging path

### Property-Based Tests

- Generate random pages.json structures with varying page counts and content - verify all pages are reported
- Generate random projects.json and news.json arrays with varying lengths - verify output format is preserved
- Generate random settings.json objects - verify output format is preserved
- Test across many scenarios to ensure no regressions in existing behavior

### Integration Tests

- Test full migration flow with all four files (projects.json, news.json, settings.json, pages.json) - verify each file is handled appropriately
- Test migration with missing files - verify skip messages appear correctly
- Test migration with Redis connection failure - verify error handling works correctly
- Test that migrated data in Redis matches source JSON files exactly
