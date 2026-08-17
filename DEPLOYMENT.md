# Shopify Theme Deployment Guide

## 🔒 Settings Management

### Important Files
- **`config/settings_data.json`** - Actual theme settings values (DON'T PUSH)
  - Contains all user-configured settings from Shopify Admin
  - Each push overwrites with local version → RESETS all admin settings
  - Excluded via `.gitignore` and `.shopifyignore`

- **`config/settings_schema.json`** - Settings schema/structure (SAFE TO PUSH)
  - Defines available settings options
  - Can be pushed safely without affecting current values

- **`templates/*.json`** - Layout configurations (DON'T PUSH)
  - Contains store-specific layout arrangements
  - Excluded to prevent overwriting admin layouts

## ✅ Correct Deployment Process

### Use the Protected LIVE Deploy Script

The project includes a guarded deploy script. It refuses to run if the
settings/layout exclusions are missing and always passes both `--nodelete` and
explicit `--ignore` patterns to Shopify CLI:

```bash
cd /Users/user/Documents/BridgeCustom/Theme/bc
./scripts/push-live.sh
```

Use this script for LIVE deploys instead of calling `shopify theme push`
directly. It protects the Admin-configured values in `config/settings_data.json`
and the Theme Editor layout files in `templates/*.json`.

### Push to LIVE Theme (Recommended)
```bash
cd /Users/user/Documents/BridgeCustom/Theme/bc

# Push with safety flags
npx shopify theme push \
  --theme="185206800684" \
  --allow-live \
  --nodelete
```

**Flags explanation:**
- `--theme="185206800684"` - Target theme ID (BridgeCustom V2 LIVE)
- `--allow-live` - Allow pushing to live theme
- `--nodelete` - **CRITICAL**: Prevent deleting remote files not in local (keeps settings intact)

### Push to Development Theme (Testing)
```bash
npx shopify theme push \
  --development \
  --nodelete
```

### Push Specific Files Only
```bash
# Only update liquid/css/js, skip settings
npx shopify theme push \
  --theme="185206800684" \
  --allow-live \
  --nodelete \
  --only="assets/**/*.js" \
  --only="assets/**/*.css" \
  --only="blocks/**/*.liquid" \
  --only="snippets/**/*.liquid"
```

## 🛡️ Safety Checklist Before Push

1. ✅ Use `--nodelete` flag ALWAYS
2. ✅ Verify `.shopifyignore` contains:
   ```
   config/settings_data.json
   templates/*.json
   ```
3. ✅ Test on development theme first
4. ✅ Check git status: `git status`
5. ✅ Never commit `config/settings_data.json` or `templates/*.json`

## 📊 File Push Matrix

| File | Push? | Why |
|------|-------|-----|
| `assets/` | ✅ Yes | Code files |
| `blocks/` | ✅ Yes | Liquid templates |
| `snippets/` | ✅ Yes | Reusable components |
| `sections/` | ✅ Yes | Section definitions |
| `config/settings_schema.json` | ✅ Yes | Settings structure |
| `config/settings_data.json` | ❌ NO | Actual user settings |
| `templates/` (liquid) | ✅ Yes | Template code |
| `templates/*.json` | ❌ NO | Layout arrangements |
| `.shopifyignore` | ✅ Yes | Configure excludes |
| `README.md` | ✅ Yes | Documentation |

## 🔄 Recommended Workflow

```bash
# 1. Create feature branch
git checkout -b feature/menu-improvements

# 2. Make code changes
# (edit files)

# 3. Test locally on development theme
npx shopify theme push --development --nodelete

# 4. Verify in admin
# (check Theme Editor)

# 5. Commit changes
git add .
git commit -m "feat: improve menu functionality"

# 6. Push to LIVE when ready
npx shopify theme push --theme="185206800684" --allow-live --nodelete

# 7. Verify on live site
# (check store frontend)
```

## ⚠️ If Settings Were Reset

To restore settings from backup:

1. **Shopify Admin backup:**
   - Go to Theme Editor
   - Manually reconfigure settings
   - Or restore from previous theme version if available

2. **Local backup:**
   ```bash
   # If you have backup of settings_data.json
   cp config/settings_data.json.backup config/settings_data.json
   # Then push with nodelete
   npx shopify theme push --nodelete
   ```

## 📝 Tips & Tricks

- **Dry run** (see what would be pushed):
  ```bash
  npx shopify theme pull  # First pull to see remote state
  ```

- **Check excluded files:**
  ```bash
  cat .shopifyignore
  ```

- **Monitor theme changes:**
  ```bash
  git diff config/settings_data.json  # Show what changed
  ```

- **Never push settings:**
  ```bash
  git status | grep settings_data
  # Should show: "nothing to commit" for this file
  ```

## 🆘 Troubleshooting

**Q: Settings still resetting?**
A: Ensure you're using `--nodelete` flag. Without it, remote settings are deleted.

**Q: Can't find settings after push?**
A: Check `.shopifyignore` file - it must list the files to exclude.

**Q: Local file override admin settings?**
A: Only `config/settings_data.json` does this. Verify it's in `.shopifyignore`.
