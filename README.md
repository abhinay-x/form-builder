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
