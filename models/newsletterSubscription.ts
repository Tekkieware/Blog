import mongoose, { Document, Schema } from 'mongoose';

export interface INewsletterSubscription extends Document {
  email: string;
  subscribedAt: Date;
}

const NewsletterSubscriptionSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  subscribedAt: { type: Date, default: Date.now },
});

export default mongoose.models.NewsletterSubscription || mongoose.model<INewsletterSubscription>('NewsletterSubscription', NewsletterSubscriptionSchema);
