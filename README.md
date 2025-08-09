
# Form Builder - React Application

A modern, responsive form builder application built with React, Vite, and Tailwind CSS. This application allows users to create custom forms with three unique question types: Categorize, Cloze, and Comprehension.

## Features

### 🏗️ Form Builder
- **Drag-and-drop** question reordering
- **Question management**: Add, edit, delete, and configure questions
- **Form settings**: Title, description, header image configuration
- **Preview mode**: Toggle between edit and preview modes
- **Save & publish**: Form draft saving and publishing capabilities

### 🎯 Question Types

#### 1. Categorize Questions
- **Drag-and-drop** items into categories
- **Builder mode**: Manage categories and items with colors
- **Preview mode**: Interactive categorization with immediate feedback
- **Validation**: Track correct/incorrect placements

#### 2. Cloze Questions
- **Fill-in-the-blank** text questions
- **Builder mode**: Configure blanks with input or dropdown types
- **Preview mode**: User-friendly blank filling interface
- **Text parsing**: Automatic blank detection from {{}} syntax

#### 3. Comprehension Questions
- **Reading passage** with sub-questions
- **Builder mode**: Add passage and configure multiple sub-questions
- **Preview mode**: Clean passage display with question collection
- **Sub-question types**: Multiple choice and short answer support

### 🎨 Design & UX
- **Responsive design**: Works on desktop, tablet, and mobile
- **Modern UI**: Clean, intuitive interface with Tailwind CSS
- **Interactive elements**: Hover effects, transitions, and loading states
- **Accessibility**: Keyboard navigation and screen reader support

## Tech Stack

### Frontend
- **React 19** with functional components and hooks
- **Vite** for fast development and building
- **Tailwind CSS** for styling and responsive design
- **React Router** for client-side routing
- **React DnD** for drag-and-drop functionality

### Dependencies
- `react-beautiful-dnd`: Drag-and-drop for question reordering
- `react-dnd`: Drag-and-drop for categorize questions
- `lucide-react`: Beautiful icons
- `react-router-dom`: Routing

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── FormBuilder.jsx          # Main form builder component
│   │   ├── common/
│   │   │   ├── Header.jsx          # Application header
│   │   │   └── ImageUpload.jsx     # Image upload component
│   │   └── QuestionTypes/
│   │       ├── CategorizeQuestion.jsx   # Categorize question component
│   │       ├── ClozeQuestion.jsx        # Cloze question component
│   │       └── ComprehensionQuestion.jsx # Comprehension question component
│   ├── pages/
│   │   ├── Home.jsx      # Landing page
│   │   ├── Builder.jsx   # Form builder page
│   │   └── Preview.jsx   # Form preview page
│   ├── utils/
│   │   └── api.js        # API utilities
│   ├── styles/
│   │   └── index.js      # Tailwind utility classes
│   ├── App.jsx           # Main application component
│   └── main.jsx          # Application entry point
├── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
=======
# 📝 Form Builder - MERN Stack Application

A modern, full-stack form builder application that allows users to create, manage, and publish interactive forms with various question types including categorization, cloze (fill-in-the-blanks), and reading comprehension questions.

## 🚀 Features

### ✨ Core Functionality
- **Form Creation & Management**: Create, edit, duplicate, and delete forms
- **Multiple Question Types**:
  - **Categorize Questions**: Drag-and-drop categorization with custom categories
  - **Cloze Questions**: Fill-in-the-blanks with dynamic blank detection
  - **Comprehension Questions**: Reading passages with sub-questions
  - **Text Questions**: Simple text input fields
- **Form Publishing**: Publish/unpublish forms for public access
- **Form Analytics**: Track views, submissions, and completion rates
- **Image Support**: Upload and manage form header images
- **Responsive Design**: Mobile-first design with dark mode support

### 🎨 User Interface
- **Modern Dashboard**: Clean, intuitive interface for form management
- **Drag-and-Drop Editor**: Visual form builder with reorderable questions
- **Real-time Preview**: Live preview of forms during creation
- **Professional Error Handling**: User-friendly error messages for different scenarios
- **Loading States**: Smooth loading indicators and skeleton screens

### 🔧 Technical Features
- **RESTful API**: Well-structured backend API with proper error handling
- **Database Integration**: MongoDB with Mongoose ODM
- **File Upload**: Image upload functionality with validation
- **Form Validation**: Comprehensive client and server-side validation
- **State Management**: Efficient React state management with hooks

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **React Hot Toast** - Elegant toast notifications
- **React DnD** - Drag and drop functionality
- **Vite** - Fast build tool and development server

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Multer** - File upload middleware
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 📁 Project Structure

```
form-builder/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── common/       # Common components (Loading, ImageUpload)
│   │   │   ├── FormBuilder/  # Form building components
│   │   │   ├── FormFill/     # Form filling components
│   │   │   └── FormPreview/  # Form preview components
│   │   ├── pages/           # Page components
│   │   │   ├── Home.jsx     # Dashboard with form management
│   │   │   ├── FormEditor.jsx # Form creation/editing
│   │   │   ├── FormViewer.jsx # Form viewing/filling
│   │   │   ├── FormResults.jsx # Form analytics
│   │   │   ├── PublishedForms.jsx # Public forms listing
│   │   │   └── FeatureNotImplemented.jsx # Placeholder page
│   │   ├── services/        # API services
│   │   ├── utils/          # Utility functions
│   │   └── assets/         # Static assets and styles
│   ├── public/             # Public assets
│   └── package.json        # Frontend dependencies
├── backend/                # Express.js backend application
│   ├── models/             # Mongoose models
│   │   ├── Form.js         # Form schema
│   │   └── Response.js     # Response schema
│   ├── routes/             # API routes
│   │   ├── forms.js        # Form CRUD operations
│   │   └── responses.js    # Response handling
│   ├── middleware/         # Custom middleware
│   ├── uploads/           # File upload directory
│   ├── server.js          # Main server file
│   └── package.json       # Backend dependencies
└── README.md              # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   ```bash

   git clone [repository-url]
   cd form-builder/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## Usage

### Creating a Form

1. **Navigate to the Builder page**
2. **Configure form settings**: Add title, description, and header image
3. **Add questions**: Click on question type buttons to add new questions
4. **Configure questions**: Click the settings icon to edit question details
5. **Reorder questions**: Drag and drop questions to reorder them
6. **Preview**: Click "Preview" to test the form
7. **Save/Publish**: Save draft or publish the form

### Question Configuration

#### Categorize Questions
- Add categories with names and colors
- Add items to categorize
- Set correct category for each item

#### Cloze Questions
- Enter text with {{}} to create blanks
- Configure each blank as input or dropdown
- Set correct answers

#### Comprehension Questions
- Add reading passage
- Add sub-questions (multiple choice or short answer)
- Configure question text and correct answers

### Form Preview
- **Fill mode**: Users can fill out the form
- **Validation**: Required questions are validated
- **Submission**: Responses are collected and submitted
- **Success**: Confirmation page after submission

## API Integration

The application is designed to work with a backend API. The following endpoints are expected:

### Form Management
- `GET /api/forms/:id` - Get form by ID
- `POST /api/forms` - Create new form
- `PUT /api/forms/:id` - Update form
- `POST /api/forms/:id/publish` - Publish form

### Response Collection
- `POST /api/responses` - Submit form response
- `GET /api/responses/:formId` - Get responses for form

## Styling

### Tailwind CSS Classes
The application uses custom Tailwind CSS classes defined in `styles/index.js`:

- **Button styles**: Primary, secondary, danger, success variants
- **Input styles**: Consistent form input styling
- **Card styles**: White cards with shadows and borders
- **Layout styles**: Responsive grid and container classes
- **Question-specific styles**: Tailored styling for each question type

### Responsive Design
- **Mobile**: Single column layout, touch-friendly interfaces
- **Tablet**: Two-column layout for larger screens
- **Desktop**: Three-column layout for optimal space usage

## Development

### Adding New Question Types
1. Create new component in `QuestionTypes/`
2. Add question type to `questionTypes` object in `FormBuilder.jsx`
3. Add styling to `styles/index.js`
4. Update preview mode in `Preview.jsx`

### Custom Styling
- Modify `styles/index.js` for global style changes
- Use Tailwind CSS utility classes for component-specific styling
- Follow the established pattern for consistent design

## Troubleshooting

### Common Issues
- **Drag-and-drop not working**: Ensure `react-beautiful-dnd` is properly installed
- **Styling issues**: Check Tailwind CSS configuration
- **Icons not showing**: Ensure `lucide-react` is installed

### Performance
- **Large forms**: Consider pagination for forms with many questions
- **Image optimization**: Use appropriate image sizes for header images
- **Bundle size**: Use code splitting for large applications

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

   git clone <repository-url>
   cd form-builder
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Configuration**

   **Backend** (`backend/.env`):
   ```env
   MONGODB_URI=mongodb://localhost:27017/formbuilder
   PORT=5052
   NODE_ENV=development
   ```

   **Frontend** (`frontend/.env`):
   ```env
   VITE_API_URL=http://localhost:5052/api
   ```

5. **Start the Development Servers**

   **Backend** (Terminal 1):
   ```bash
   cd backend
   npm start
   ```

   **Frontend** (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the Application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5052`

## 📋 API Endpoints

### Forms API
- `GET /api/forms` - Get all forms
- `GET /api/forms/:id` - Get form by ID
- `POST /api/forms` - Create new form
- `PUT /api/forms/:id` - Update form
- `DELETE /api/forms/:id` - Delete form
- `POST /api/forms/:id/publish` - Publish/unpublish form
- `POST /api/forms/duplicate/:id` - Duplicate form
- `POST /api/forms/upload` - Upload image

### Responses API
- `GET /api/responses` - Get all responses
- `GET /api/responses/form/:formId` - Get responses for specific form
- `POST /api/responses` - Submit form response
- `GET /api/responses/analytics/:formId` - Get form analytics

## 🎯 Usage Guide

### Creating a Form
1. Navigate to the dashboard
2. Click "Create New Form"
3. Add form title and description
4. Add questions using the question type buttons
5. Configure each question with appropriate settings
6. Save and publish the form

### Managing Forms
- **Edit**: Click the edit button on any form card
- **Publish/Unpublish**: Use the dropdown menu on form cards
- **Duplicate**: Create copies of existing forms
- **Delete**: Remove forms permanently
- **View Results**: Access form analytics and responses

### Question Types
- **Categorize**: Create drag-and-drop categorization questions
- **Cloze**: Build fill-in-the-blank questions with automatic blank detection
- **Comprehension**: Add reading passages with multiple sub-questions
- **Text**: Simple text input questions

## 🚀 Deployment

### Vercel Deployment

1. **Prepare for Deployment**
   - Set up MongoDB Atlas for production database
   - Configure environment variables

2. **Deploy Backend**
   ```bash
   cd backend
   vercel
   vercel env add MONGODB_URI
   vercel env add NODE_ENV
   vercel --prod
   ```

3. **Deploy Frontend**
   ```bash
   cd frontend
   vercel
   vercel env add VITE_API_URL
   vercel --prod
   ```

### Environment Variables for Production
- **Backend**: `MONGODB_URI`, `NODE_ENV`
- **Frontend**: `VITE_API_URL`

## 🧪 Development Notes

### Current Status
- ✅ Form creation and management
- ✅ Multiple question types
- ✅ Form publishing system
- ✅ Image upload functionality
- ✅ Responsive design
- ✅ Error handling
- 🚧 Form response submission (placeholder implemented)
- 🚧 Advanced analytics
- 🚧 User authentication

### Known Issues
- Form response feature redirects to "Feature Not Implemented" page
- File upload size limitations on Vercel deployment
- MongoDB Atlas configuration required for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **MongoDB** for the flexible database solution
- **Vercel** for seamless deployment platform

## 📞 Support

For support, email [your-email@example.com] or create an issue in the repository.

---

**Built with ❤️ using the MERN Stack**

