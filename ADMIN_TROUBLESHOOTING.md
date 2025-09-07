# 🔧 Admin Setup Troubleshooting Guide

## Step 1: Check Your Current User Status

1. **Go to your profile page** (`/profile`)
2. **Look at the debug information** at the top of the page
3. **Check the "Role" field** - it should show your current role

## Step 2: Set Admin Role in Clerk

### Option A: Via Clerk Dashboard (Easiest)
1. **Go to [Clerk Dashboard](https://dashboard.clerk.com)**
2. **Navigate to Users** → Find your email address
3. **Click on your user** to open user details
4. **Click "Public metadata"** tab
5. **Add this JSON:**
   ```json
   {
     "role": "admin"
   }
   ```
6. **Click "Save"**
7. **Refresh your browser** (hard refresh: Cmd+Shift+R on Mac)

### Option B: Via Clerk API (If dashboard doesn't work)
```bash
# Replace with your actual user ID from Clerk dashboard
USER_ID="user_xxxxxxxxxxxxx"

# Replace with your Clerk secret key
CLERK_SECRET="sk_test_xxxxxxxxxxxxx"

curl -X PATCH "https://api.clerk.com/v1/users/$USER_ID/metadata" \
  -H "Authorization: Bearer $CLERK_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"public_metadata": {"role": "admin"}}'
```

## Step 3: Verify Admin Access

1. **Refresh your profile page** (`/profile`)
2. **Check the debug info** - "Role" should now show "admin"
3. **Look for "Admin" button** in the header (top right)
4. **Click "Admin" button** - should take you to `/admin`

## Step 4: Test Admin Functions

1. **Create a test event** with images
2. **Go to Admin panel** (`/admin`)
3. **Check "Pending Events"** section
4. **Click "Approve"** on your test event
5. **Go to homepage** (`/`) - event should now be visible

## Step 5: Test Image Management

1. **Go to your profile** (`/profile`)
2. **Click "Edit"** on an event
3. **Test image functions:**
   - **Delete existing images** (red X button)
   - **Replace existing images** (upload button)
   - **Add new images** (main upload area)

## Troubleshooting

### If "Admin" button doesn't appear:
- ✅ Check user metadata shows `{"role": "admin"}`
- ✅ Hard refresh browser (Cmd+Shift+R)
- ✅ Clear browser cache
- ✅ Check browser console for errors

### If admin panel shows errors:
- ✅ Check Supabase RLS policies are applied
- ✅ Verify you're signed in
- ✅ Check browser console for API errors

### If events don't show after approval:
- ✅ Check event status in Supabase dashboard
- ✅ Verify RLS policies allow public viewing
- ✅ Check browser console for errors

## Quick Test Checklist

- [ ] User metadata shows `{"role": "admin"}`
- [ ] "Admin" button appears in header
- [ ] Admin panel loads without errors
- [ ] Can see pending events
- [ ] Can approve events
- [ ] Approved events appear on homepage
- [ ] Can edit events and manage images

## Need Help?

If you're still having issues, check:
1. **Browser console** for any error messages
2. **Network tab** for failed API calls
3. **Supabase dashboard** for RLS policy status
4. **Clerk dashboard** for user metadata

The debug components on your profile page will help identify exactly what's happening!
