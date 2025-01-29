# wireless-shark-frontend

A modern web-based application for real-time CAN bus data logging and visualization, built with Next.js and TypeScript.

## Features

### Real-time CAN Bus Monitoring
- Live data capture via WebSocket connection
- Support for multiple CAN interfaces
- DBC file integration for signal interpretation
- Configurable logging parameters

### Dynamic Visualization
- Customizable dashboard with draggable widgets
- Multiple visualization types:
  - Line charts for time-series data
  - Real-time value displays
  - Hex/Binary data views
  - Table views with signal details
- Auto-updating displays with pause functionality
- Layout persistence across sessions

### Configuration Management
- DBC file upload and management
- CAN interface configuration
- YAML-based logger settings
- Assignment management for CAN sockets and DBC files

## Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm/yarn/pnpm

### Installation

1. Clone the repository
```
git clone git@github.com:YellowPirat/wireless-shark-frontend.git
```

2. Install dependencies
```
npm install
```

3. Run the development server
```
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production
5. Built static files
```
npm run build
```

## Usage

### Basic Setup

1. Navigate to the Settings page
2. Upload your DBC files
3. Configure CAN interface assignments
4. Start the logger for your desired interface

### Creating Visualizations

1. Go to the Live View page
2. Select your CAN interface from the navigation menu
3. Use the sidebar to add widgets:
   - Choose a message from your DBC file
   - Select signals to display
   - Pick a visualization type
4. Arrange widgets by dragging them on the dashboard
5. Save your layout for future sessions

## Technical Details

### Built With
- [Next.js](https://nextjs.org/) - React Framework
- [TypeScript](https://www.typescriptlang.org/) - Type Safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI Components
- [Recharts](https://recharts.org/) - Charting Library
- [GridStack](https://gridstackjs.com/) - Grid Layout System

### Architecture
- Client-side DBC parsing
- WebSocket-based real-time data streaming
- Modular component structure
- Responsive design

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Created by TI 5 in WiSe 2024/25

## Support

For support, please open an issue in the GitHub repository or contact the development team.
