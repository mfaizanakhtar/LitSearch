import mongoose from 'mongoose';

const PaperArticleSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: [true, 'Please provide a title for this post.'],
//     maxlength: [60, 'Title cannot be more than 60 characters'],
//   },
//   content: {
//     type: String,
//     required: [true, 'Please provide content for this post.'],
//   },
  paperId:{type:String,unique:true,required:true},
  title:String,
  abstract:String
});

export default mongoose.models.PaperArticle || mongoose.model('paper-articles', PaperArticleSchema);
