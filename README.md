This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the `.env.example` file to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required environment variables:

- **Database Configuration**: Your MySQL database credentials
  - `DB_HOST`: Database host
  - `DB_USER`: Database user
  - `DB_NAME`: Database name
  - `DB_PASSWORD`: Database password

- **Resend API Key**: For sending emails
  - `RESEND_API_KEY`: Get your API key from [https://resend.com/api-keys](https://resend.com/api-keys)
  - You need to sign up for a free account at Resend
  - Free tier includes 100 emails/day and 3,000 emails/month

- **Application URL**:
  - `NEXT_PUBLIC_APP_URL`: Your application URL (e.g., `http://localhost:3000` for local development)

### 3. Set up Resend (for Email Functionality)

1. Go to [https://resend.com](https://resend.com) and create a free account
2. Navigate to API Keys section
3. Create a new API key
4. Copy the API key and add it to your `.env.local` file as `RESEND_API_KEY`
5. (Optional) Add and verify your domain for production use. In development, you can use the default `onboarding@resend.dev` sender

**Note**: Update the `from` field in `/app/api/send-emails/route.ts` to use your verified domain:

```typescript
from: "Your Name <your-email@yourdomain.com>";
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 5. (Optional) Preview Email Templates

This project uses [React Email](https://react.email) for email templates. To preview and develop email templates:

```bash
npm run email
```

This will open a preview interface at [http://localhost:3001](http://localhost:3001) where you can:

- See live previews of your email templates
- Test different props and states
- View how emails render in different email clients
- Export HTML for testing

Email templates are located in the `/emails` directory.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
