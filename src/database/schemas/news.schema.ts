import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type NewsDocument = mongoose.HydratedDocument<News>;

@Schema()
export class News {
  @Prop()
  title: string;
  @Prop()
  source: string;
  @Prop()
  date: string;
  @Prop()
  link: string;
  @Prop()
  body: string;
  @Prop()
  image: string;
}

export const NewsSchema = SchemaFactory.createForClass(News);
