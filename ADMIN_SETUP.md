# Admin Setup Instructions for Rond-point Express

## 1. Set Up RLS Policies

Run the SQL script in your Supabase SQL editor:

```sql
-- Copy and paste the contents of supabase-secure-rls-setup.sql
-- This sets up proper Row Level Security policies
```

## 2. Make Your User an Admin

### Option A: Via Clerk Dashboard (Recommended)
1. Go to your Clerk Dashboard
2. Navigate to Users → [Your User]
3. Click on "Public metadata"
4. Add: `{"role": "admin"}`
5. Save changes

### Option B: Via Clerk API (Alternative)
```bash
# Get your user ID from Clerk dashboard
USER_ID="your_clerk_user_id"

# Update user metadata (requires Clerk API key)
curl -X PATCH "https://api.clerk.com/v1/users/$USER_ID/metadata" \
  -H "Authorization: Bearer YOUR_CLERK_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{"public_metadata": {"role": "admin"}}'
```

## 3. Test the Setup

1. **Refresh your browser** to get updated user metadata
2. **Check header** - you should see "Admin" button
3. **Go to `/admin`** - should show admin dashboard
4. **Create a test event** with images
5. **Approve the event** in admin panel
6. **Check homepage** - event should appear

## 4. Admin Panel Features

- **Pending Events**: View events awaiting approval
- **Approve/Reject**: Click buttons to moderate events
- **Real-time Updates**: Data refreshes after actions
- **User Management**: View user statistics (mock data for now)

## 5. Image Upload Features

- **Real Supabase Storage**: Images upload to actual storage
- **Delete Existing Images**: Red X button on existing images
- **Add New Images**: Upload additional images
- **File Validation**: 100KB-2.5MB size limits
- **Error Handling**: Graceful fallback if upload fails

## Troubleshooting

### If Admin Button Doesn't Appear:
- Check user metadata in Clerk dashboard
- Refresh browser page
- Clear browser cache

### If Images Don't Upload:
- Check Supabase storage bucket exists
- Verify RLS policies are applied
- Check browser console for errors

### If Events Don't Show After Approval:
- Check event status in Supabase
- Verify RLS policies allow public viewing
- Check browser console for API errors
