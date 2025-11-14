# Pokemon Card Scanner

A modern web application built with Next.js 14 and TypeScript that uses AI to identify Pokemon cards and provide real-time market valuations.

## Features

- **AI-Powered Card Recognition**: Uses GPT-4 Vision to automatically identify Pokemon cards from photos
- **Real-Time Pricing**: Fetches current market prices from TCGPlayer API
- **Condition-Based Valuation**: Adjusts prices based on card condition (Near Mint, Lightly Played, etc.)
- **Scan History**: Stores scan history locally in the browser
- **CSV Export**: Export your card collection and valuations to CSV
- **Mobile Camera Support**: Take photos directly with your device camera
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **AI**: OpenAI GPT-4 Vision API
- **Pricing**: TCGPlayer API (with fallback estimation)
- **Storage**: Browser localStorage

## Prerequisites

- Node.js 18+
- npm or yarn
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))
- (Optional) TCGPlayer API key for real pricing data

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd pokemon-card-scanner-ts
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API keys:

```env
OPENAI_API_KEY=your_openai_api_key_here
TCGPLAYER_API_KEY=your_tcgplayer_api_key_here  # Optional
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Upload or Capture**: Click "Take Photo" to use your camera, or "Upload Image" to select a file
2. **AI Recognition**: The app automatically identifies the card using GPT-4 Vision
3. **Select Condition**: Choose the card's condition from the dropdown
4. **Get Price**: Click "Get Price Estimate" to fetch current market value
5. **View History**: Scroll down to see your scan history
6. **Export Data**: Click "Export CSV" to download your collection data

## Card Conditions

- **Near Mint**: Fresh from pack, minimal wear (100% of market price)
- **Lightly Played**: Minor edge wear, slight scratches (85%)
- **Moderately Played**: Noticeable wear, some whitening (65%)
- **Heavily Played**: Significant wear, creases visible (45%)
- **Damaged**: Major damage, heavily worn or bent (25%)

## API Routes

### POST /api/recognize

Identifies a Pokemon card from an image using GPT-4 Vision.

**Request Body:**
```json
{
  "image": "data:image/jpeg;base64,..."
}
```

**Response:**
```json
{
  "success": true,
  "card": {
    "name": "Charizard",
    "setName": "Base Set",
    "cardNumber": "4/102",
    "rarity": "Rare Holo"
  },
  "confidence": 0.9
}
```

### POST /api/pricing

Fetches pricing data for a Pokemon card.

**Request Body:**
```json
{
  "cardName": "Charizard",
  "setName": "Base Set",
  "cardNumber": "4/102",
  "condition": "Near Mint"
}
```

**Response:**
```json
{
  "success": true,
  "pricing": {
    "condition": "Near Mint",
    "price": 450.00,
    "source": "TCGPlayer",
    "marketPrice": 450.00,
    "lowPrice": 350.00,
    "highPrice": 550.00,
    "lastUpdated": "2024-01-15T10:30:00Z"
  }
}
```

## Project Structure

```
pokemon-card-scanner-ts/
├── app/
│   ├── api/
│   │   ├── recognize/      # GPT-4 Vision card recognition
│   │   └── pricing/        # TCGPlayer pricing integration
│   ├── globals.css         # Global styles and theme
│   └── page.tsx            # Main application page
├── components/
│   ├── ui/                 # Shadcn UI components
│   ├── CardUpload.tsx      # Image upload/camera component
│   ├── ConditionSelector.tsx
│   ├── CardResults.tsx     # Display card info and pricing
│   └── ScanHistory.tsx     # Scan history and CSV export
├── hooks/
│   └── useScans.ts         # Custom hook for scan management
├── lib/
│   ├── services/
│   │   └── storage.ts      # localStorage service
│   └── utils.ts            # Utility functions
├── types/
│   └── index.ts            # TypeScript type definitions
└── .env.local              # Environment variables (create this)
```

## Building for Production

```bash
npm run build
npm start
```

## Deployment

This app can be deployed to any platform that supports Next.js:

- **Vercel** (recommended): `vercel deploy`
- **Netlify**: Connect your Git repository
- **Railway**: Deploy via CLI or GitHub integration
- **Docker**: Build and deploy as a container

### Environment Variables for Production

Make sure to set these in your deployment platform:
- `OPENAI_API_KEY` (required)
- `TCGPLAYER_API_KEY` (optional)

## Limitations & Future Improvements

### Current Limitations
- TCGPlayer API requires authentication setup
- Pricing estimation is simplified for cards without API access
- Scan history is stored locally (not synced across devices)

### Potential Enhancements
- User authentication with Supabase
- Cloud storage for scan history
- Price history tracking and trends
- Support for other card games (MTG, Yu-Gi-Oh)
- Barcode scanning support
- Bulk upload and scanning
- Collection management features
- Price alerts and notifications

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions:
1. Check existing GitHub issues
2. Create a new issue with details
3. Include error messages and screenshots if applicable

## Acknowledgments

- OpenAI for GPT-4 Vision API
- TCGPlayer for pricing data
- Shadcn/ui for beautiful components
- Next.js team for an amazing framework
