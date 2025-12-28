# Material Request Tracker

A modern construction material request management system built with React, TypeScript, and Supabase. This application enables construction teams to efficiently track, manage, and approve material requests across multiple projects.

## 🚀 Features

- **Material Request Management**: Create, edit, and delete material requests
- **Status Workflow**: Track requests through pending → approved → delivered states
- **Multi-tenancy**: Company-level data isolation with Row Level Security (RLS)
- **Real-time Updates**: Optimistic updates with React Query
- **Filtering & Search**: Filter requests by status
- **Export Functionality**: Export data to CSV
- **Responsive UI**: Modern interface built with shadcn/ui and Tailwind CSS
- **Authentication**: Secure user authentication with Supabase Auth

## 🛠️ Tech Stack

- **Frontend**: React 19+ with TypeScript
- **Build Tool**: Vite
- **Database & Auth**: Supabase (PostgreSQL + Auth)
- **State Management**: TanStack React Query (v5)
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form + Zod
- **Date Formatting**: date-fns

## 📋 Prerequisites

- Node.js 18+ and npm/pnpm
- A Supabase account (free tier works)
- Git

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yassinkr/test-track-material-requests
cd test-track-material-requests
npm install
```

### 2. Supabase Setup

#### A. Create a New Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details and wait for setup to complete

#### B. Get Your API Keys

1. Go to Project Settings → API
2. Copy your:
   - Project URL
   - `anon` public API key

#### C. Configure Environment Variables

Create a `.env.local` file in the root directory:

 VITE_SUPABASE_URL=supabase_project_url
VITE_SUPABASE_ANON_KEY=supabase_anon_key
 

### 3. Database Migration

Run the following SQL scripts in order in your Supabase SQL Editor:

#### Step 1: Create Companies Table

 -- Create companies table
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default company
INSERT INTO public.companies (id, name) VALUES
  ('11111111-1111-1111-1111-111111111111', 'BuildRight Construction');
 

#### Step 2: Create Profiles Table

 -- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  company_id UUID NOT NULL REFERENCES public.companies(id),
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- Policy: Users can update their own profile  
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);


#### Step 3: Create Auto-Profile Trigger


-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, company_id, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    '11111111-1111-1111-1111-111111111111',
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
 

#### Step 4: Create Material Requests Table

 
-- Create material_requests table
CREATE TABLE public.material_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID,
  material_name TEXT NOT NULL,
  quantity NUMERIC NOT NULL CHECK (quantity > 0),
  unit TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'delivered')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  requested_by UUID NOT NULL REFERENCES auth.users(id),
  requested_by_name TEXT NOT NULL,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  company_id UUID NOT NULL REFERENCES public.companies(id)
);

-- Create indexes for better performance
CREATE INDEX idx_material_requests_company ON material_requests(company_id);
CREATE INDEX idx_material_requests_status ON material_requests(status);
CREATE INDEX idx_material_requests_priority ON material_requests(priority);
CREATE INDEX idx_material_requests_requested_at ON material_requests(requested_at DESC);
 

#### Step 5: Enable RLS on Material Requests

```sql
-- Enable RLS
ALTER TABLE material_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view requests from their company
CREATE POLICY "Users can view their company requests"
ON material_requests FOR SELECT
USING (
  company_id = (
    SELECT company_id FROM public.profiles WHERE id = auth.uid()
  )
);

-- Policy: Users can insert requests for their company
CREATE POLICY "Users can create requests for their company"
ON material_requests FOR INSERT
WITH CHECK (
  company_id = (
    SELECT company_id FROM public.profiles WHERE id = auth.uid()
  )
);

-- Policy: Users can update their company's requests
CREATE POLICY "Users can update their company requests"
ON material_requests FOR UPDATE
USING (
  company_id = (
    SELECT company_id FROM public.profiles WHERE id = auth.uid()
  )
);

-- Policy: Users can delete their company's requests
CREATE POLICY "Users can delete their company requests"
ON material_requests FOR DELETE
USING (
  company_id = (
    SELECT company_id FROM public.profiles WHERE id = auth.uid()
  )
);
 

#### Step 6: Insert Sample Data (Optional)

 
-- Create profiles for existing users (if any)
INSERT INTO public.profiles (id, email, company_id, full_name)
SELECT 
  id, 
  email, 
  '11111111-1111-1111-1111-111111111111',
  COALESCE(raw_user_meta_data->>'full_name', email)
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles);

-- Insert sample material requests
INSERT INTO material_requests (
  material_name, quantity, unit, status, priority, 
  requested_by, requested_by_name, company_id, notes
)
SELECT
  'Cement Bags (50kg)', 100, 'bags', 'pending', 'high',
  id, email, '11111111-1111-1111-1111-111111111111',
  'Needed for foundation work'
FROM auth.users LIMIT 1;
 

### 4. Run the Application

 npm run dev
 
The application will be available at `http://localhost:5173`

## 🏗️ Project Structure

 src/
├── components/          # React components
│   ├── ui/             # shadcn/ui base components
│   ├── MaterialRequestForm.tsx
│   ├── MaterialRequestTable.tsx
│   ├── StatusBadge.tsx
│   └── StatusUpdateDialog.tsx
├── contexts/           # React contexts
│   └── AuthContext.tsx
├── hooks/              # Custom React hooks
│   └── useMaterialRequests.ts
├── lib/                # Utilities and configurations
│   ├── supabase.ts
│   └── utils.ts
├── pages/              # Page components
│   └── MaterialRequests.tsx
├── types/              # TypeScript type definitions
│   └── material-request.ts
└── App.tsx
 
## 🔑 Key Design Decisions

### Architecture

**Component-Based Architecture**: The application follows React best practices with clear separation between presentational and container components.

**Custom Hooks Pattern**: Data fetching logic is encapsulated in custom hooks (`useMaterialRequests`), promoting reusability and testability.

**Type Safety**: TypeScript is used throughout with strict typing, reducing runtime errors and improving developer experience.

### State Management

**React Query**: Chosen for its excellent caching, synchronization, and optimistic updates. Benefits include:
- Automatic background refetching
- Optimistic updates for instant UI feedback
- Built-in loading and error states
- Cache invalidation strategies

**Context API**: Used for authentication state, which is accessed globally but changes infrequently.

### Security

**Row Level Security (RLS)**: Implemented at the database level to ensure data isolation between companies. This is more secure than application-level filtering.

**Multi-Tenancy**: Each user belongs to a company, and can only access their company's data through RLS policies.

**Server-Side Validation**: Supabase CHECK constraints ensure data integrity (e.g., quantity > 0, valid status values).

### UI/UX

**Optimistic Updates**: When updating request status, the UI updates immediately while the server processes the request. If it fails, changes are rolled back.

**Loading States**: Skeleton loaders provide better perceived performance during data fetching.

**Confirmation Dialogs**: Critical actions (status changes, deletions) require confirmation to prevent accidental operations.

**Responsive Design**: Tailwind CSS ensures the application works well on all screen sizes.

### Performance

**Database Indexes**: Added indexes on frequently queried columns (company_id, status, priority, requested_at) for faster queries.

**Query Caching**: React Query caches responses, reducing unnecessary network requests.

**Code Splitting**: Vite's automatic code splitting ensures faster initial load times.

## 📊 Database Schema

### ERD Overview

 
companies
  ↓ (one-to-many)
profiles (extends auth.users)
  ↓ (one-to-many)
material_requests
 

### Relationships

- **companies** → **profiles**: One company has many users
- **profiles** → **material_requests**: One user creates many requests
- **auth.users** ← **profiles**: One-to-one relationship (extends user data)

## 🔐 Authentication Flow

1. User signs up → Supabase Auth creates user in `auth.users`
2. Trigger automatically creates profile in `profiles` table
3. Profile includes `company_id` for multi-tenancy
4. RLS policies enforce company-level data isolation
5. Frontend fetches profile on auth state change

## 🧪 Testing Considerations

While tests are not included, the architecture supports easy testing:

- **Custom hooks** can be tested with `@testing-library/react-hooks`
- **Components** can be tested with `@testing-library/react`
- **Supabase queries** can be mocked for unit tests
- **E2E tests** can be added with Playwright or Cypress

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

 npm run build
 

Set environment variables in your hosting platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Database Migrations

For production, consider:
- Version control your SQL migrations
- Use Supabase CLI for automated migrations
- Test migrations in staging environment first

## 📝 Future Enhancements

- **AI Integration**: Material name auto-suggestions, quantity estimation
- **Projects Table**: Full project management with material tracking
- **Notifications**: Email/push notifications for status changes
- **Analytics Dashboard**: Material usage trends and cost analysis
- **Mobile App**: React Native version for on-site access
- **File Attachments**: Upload receipts and documentation
- **Approval Workflows**: Multi-level approval chains
- **Inventory Integration**: Real-time stock tracking

## 🐛 Troubleshooting

### RLS Policies Not Working

 -- Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Check policies
SELECT * FROM pg_policies WHERE tablename = 'material_requests';
 
### Profile Not Created on Signup

Check if the trigger exists:

```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
 

### Cannot See Data

Ensure you're logged in and have a profile with valid `company_id`:

```sql
SELECT * FROM profiles WHERE id = auth.uid();
 

 
 
