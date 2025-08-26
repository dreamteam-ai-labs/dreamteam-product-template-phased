# Phase 6: Make It Actually Work

## 🎯 Mission: From Plans to Product

Your Phase 5 delivered specifications and structure. Now make {{PRIMARY_FEATURE}} actually run.

## ⚠️ Critical Requirement

**You MUST deliver a RUNNING {{PRIMARY_FEATURE}} by the end of this phase.**

Success is defined as:
```bash
npm test         # At least 5 tests pass
npm run dev      # Server starts without errors
curl localhost:{{PORT}}/health  # Returns {"status":"ok"}
```

## 📋 Delivery Checklist

### 1. Core Implementation (REQUIRED)
Based on your {{TECH_STACK}} stack, ensure these exist with WORKING CODE:
- [ ] Main application entry point that starts successfully
- [ ] {{PRIMARY_FEATURE}} core logic implementation
- [ ] Data models/schemas for your domain
- [ ] API endpoints or interfaces for {{PRIMARY_FEATURE}}
- [ ] Business logic layer with proper separation
- [ ] Error handling throughout

### 2. Minimum Viable Endpoints/Features
Your {{PRIMARY_FEATURE}} must have at least 3 working operations:
- [ ] Primary CREATE/ADD operation
- [ ] Primary READ/GET operation  
- [ ] Primary UPDATE/DELETE operation
- [ ] All operations handle errors gracefully
- [ ] All operations validate input

### 3. Working Tests
At minimum, these tests must PASS:
```javascript
✓ {{PRIMARY_FEATURE}} can be created
✓ {{PRIMARY_FEATURE}} can be retrieved
✓ {{PRIMARY_FEATURE}} validates input
✓ Invalid requests are rejected
✓ Data persists correctly
```

### 4. Local Development Setup
```bash
# These commands must work:
npm install          # Installs all dependencies
npm run migrate      # Sets up database/storage (if applicable)
npm run dev          # Starts the application
npm test            # Runs tests (at least 5 pass)
npm run validate    # Runs Phase 6 validation
```

## 🎭 Implementation Requirements

1. **Use the LinearClient** from `scripts/linear-client.js` for any Linear operations
2. **Check existing work** - What did Phase 5 actually create?
3. **Fill the gaps** - Implement what's missing
4. **Test as you go** - Verify each piece works
5. **No empty files** - Every file must have working code

## 🏁 Definition of Done

Phase 6 is complete when:

1. ✅ Application starts with `npm run dev`
2. ✅ At least 5 tests pass with `npm test`  
3. ✅ {{PRIMARY_FEATURE}} works end-to-end
4. ✅ Data persists appropriately for your use case
5. ✅ Input validation prevents bad data
6. ✅ Code exists in all required files (not empty)
7. ✅ README includes setup instructions

## 💡 Implementation Hints

### Quick Start Based on {{TECH_STACK}}
- Start with the simplest working version
- Use SQLite/JSON file if database is complex
- Mock external services initially
- Focus on core functionality first

### Progressive Enhancement
1. Get server/app running first
2. Add one working endpoint/feature
3. Make data persist
4. Add validation
5. Add remaining features
6. Polish and document

## 📝 Required Retrospective

Create a Linear issue titled "Phase 6 Retrospective: Working Implementation" with:
1. **Gap Analysis**: What was missing from Phase 5
2. **Implementation Challenges**: Hardest parts to make work
3. **Debug Journey**: What errors you encountered and fixed
4. **Time Breakdown**: How long each component took
5. **Quality Assessment**: How production-ready is the code

## 🔑 Completion Verification

When you believe Phase 6 is complete, run:
```bash
npm run validate

# This will check:
# - Application starts successfully
# - {{PRIMARY_FEATURE}} endpoints/features work
# - Tests pass
# - Data persistence works
# - No empty implementation files
```

Show the validation output to prove completion.

---

**The Virtual Software House delivered plans. Now deliver {{PRODUCT_NAME}} with working {{PRIMARY_FEATURE}}.**