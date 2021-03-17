const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required:[true, 'A tour must have a name'],
        unique: [true, 'different tours can not have thesame name'],
        trim: true
    },

    duration: {
        type: Number,
        required:[true, 'A tour must have a duration'],
    },

    maxGroupSize: {
        type: Number,
        required:[true, 'A tour must have a max group size'],
    },

    difficulty: {
        type: String,
        required:[true, 'A tour must have a difficulty'],
        enum:{
            values: ['easy', 'medium', 'difficult'],
            message: 'difficulty should be either easy, medium or difficult'
        }
    },

    ratingAverage: {
        type: Number,
        default: 4.5,
    },

    ratingQuantity: {
        type: Number,
        default: 0,
    },

    price: {
        type: Number,
        required:[true, 'A price must be set'],
    },

    priceDiscount: Number,

    summary: {
        type: String,
        required:[true, 'A tour must have a summary'],
        trim: true
    },

    description: {
        type: String,
        required:[true, 'A tour must have a description'],
        trim: true
    },

    imageCover: {
        type: String,
        required:[true, 'A tour must have a cover image'],
    },

    images: [String],

    createAt: {
        type: Date,
        default: Date.now()
    },
    
    startDates: [Date],
    slug: String,
    secretTour: {
        type: Boolean,
        default: "false"
    },

    user_id: String
},
{ 
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
}
);

tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name);
    next();
});

tourSchema.virtual('durationWeeks').get(function(){
    return this.duration/7;
})


const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;