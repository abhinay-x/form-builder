const mongoose = require('mongoose');

// Question Schema for different question types
const QuestionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['categorize', 'cloze', 'comprehension', 'text']
  },
  text: {
    type: String,
    required: true
  },
  description: String,
  image: String,
  required: {
    type: Boolean,
    default: true
  },
  points: {
    type: Number,
    default: 1
  },
  
  // For Categorize questions
  categories: [String],
  items: [String],
  
  // For Cloze questions
  options: [String], // Optional word bank
  
  // For Comprehension questions
  passage: String,
  subQuestions: [{
    text: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['multiple-choice', 'text'],
      default: 'text'
    },
    options: [String], // For multiple choice sub-questions
    correctAnswer: String,
    points: {
      type: Number,
      default: 1
    }
  }],
  
  // Common fields
  order: {
    type: Number,
    default: 0
  }
});

// Main Form Schema
const FormSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  headerImage: String,
  
  questions: [QuestionSchema],
  
  // Form settings
  settings: {
    allowAnonymous: {
      type: Boolean,
      default: true
    },
    requireEmail: {
      type: Boolean,
      default: false
    },
    allowMultipleSubmissions: {
      type: Boolean,
      default: false
    },
    showProgressBar: {
      type: Boolean,
      default: true
    },
    shuffleQuestions: {
      type: Boolean,
      default: false
    },
    timeLimit: Number, // in minutes
    showCorrectAnswers: {
      type: Boolean,
      default: false
    },
    showScores: {
      type: Boolean,
      default: false
    }
  },
  
  // Form status
  status: {
    type: String,
    enum: ['draft', 'published', 'closed'],
    default: 'draft'
  },
  
  // Analytics
  analytics: {
    totalViews: {
      type: Number,
      default: 0
    },
    totalSubmissions: {
      type: Number,
      default: 0
    },
    averageCompletionTime: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    }
  },
  
  // Metadata
  createdBy: {
    type: String,
    default: 'Anonymous'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  publishedAt: Date,
  closedAt: Date
});

// Indexes for better performance
FormSchema.index({ createdAt: -1 });
FormSchema.index({ status: 1 });
FormSchema.index({ 'analytics.totalSubmissions': -1 });

// Virtual for form URL
FormSchema.virtual('shareUrl').get(function() {
  return `/form/${this._id}`;
});

FormSchema.virtual('previewUrl').get(function() {
  return `/form/${this._id}/preview`;
});

// Virtual for isPublished (for backward compatibility)
FormSchema.virtual('isPublished').get(function() {
  return this.status === 'published';
});

// Calculate total possible score
FormSchema.virtual('maxScore').get(function() {
  return this.questions.reduce((total, question) => {
    if (question.type === 'comprehension' && question.subQuestions) {
      return total + question.subQuestions.reduce((subTotal, subQ) => 
        subTotal + (subQ.points || 1), 0);
    }
    return total + (question.points || 1);
  }, 0);
});

// Update the updatedAt field before saving
FormSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Update analytics when form is viewed
FormSchema.methods.incrementViews = function() {
  this.analytics.totalViews += 1;
  return this.save();
};

// Update analytics when form is submitted
FormSchema.methods.incrementSubmissions = function(completionTime, score) {
  this.analytics.totalSubmissions += 1;
  
  if (completionTime) {
    const currentAvg = this.analytics.averageCompletionTime || 0;
    const totalSubmissions = this.analytics.totalSubmissions;
    this.analytics.averageCompletionTime = 
      ((currentAvg * (totalSubmissions - 1)) + completionTime) / totalSubmissions;
  }
  
  if (score !== undefined && score !== null) {
    const currentAvgScore = this.analytics.averageScore || 0;
    const totalSubmissions = this.analytics.totalSubmissions;
    this.analytics.averageScore = 
      ((currentAvgScore * (totalSubmissions - 1)) + score) / totalSubmissions;
  }
  
  return this.save();
};

// Method to publish form
FormSchema.methods.publish = function() {
  this.status = 'published';
  this.publishedAt = Date.now();
  return this.save();
};

// Method to close form
FormSchema.methods.close = function() {
  this.status = 'closed';
  this.closedAt = Date.now();
  return this.save();
};

// Method to duplicate form
FormSchema.methods.duplicate = function() {
  const duplicatedForm = new this.constructor({
    title: `${this.title} (Copy)`,
    description: this.description,
    headerImage: this.headerImage,
    questions: this.questions.map(q => ({
      ...q.toObject(),
      _id: undefined
    })),
    settings: { ...this.settings },
    status: 'draft',
    createdBy: this.createdBy
  });
  
  return duplicatedForm.save();
};

// Ensure virtual fields are serialized
FormSchema.set('toJSON', { virtuals: true });
FormSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Form', FormSchema);
