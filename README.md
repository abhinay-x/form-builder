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
