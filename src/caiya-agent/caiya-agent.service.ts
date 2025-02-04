import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { News } from 'src/database/schemas/news.schema';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';
import { HttpService } from '@nestjs/axios';
import { ChatCompletionMessageParam } from 'openai/resources';
import { Cron } from '@nestjs/schedule';
// import * as https from 'https';

dotenv.config();

@Injectable()
export class CaiyaAgentService {
  private readonly openai: OpenAI;
  constructor(
    @InjectModel(News.name)
    private readonly newsModel: Model<News>,
    private readonly httpService: HttpService,
  ) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      // baseURL: 'https://api.deepseek.com',
    });
  }

  async caiyaAgent(newsBody: any) {
    const systemPrompt = `
You are an AI agent designed to process news content efficiently. Follow these rules when handling the provided news content:

1. Analyze the provided news content and generate a concise, accurate detailed summary highlighting the key points.
2. If the news body contains any language other than English, detect it and translate the entire content into fluent English before summarizing.
3. Ensure the summary is clear, professional, and easy to understand.
4. Avoid adding any personal opinions or unnecessary details that are not part of the original news content.
5. Keep the summary brief, not exceeding 150 words, while maintaining the core information.
6. Maintain a formal tone suitable for professional audiences and news platforms.

Now, based on these rules, process the provided news content and return the summary.
`;

    try {
      const allPosts = [
        { role: 'system', content: `${systemPrompt}` },

        { role: 'user', content: `${newsBody}` },
      ];
      const response = await this.openai.chat.completions.create({
        messages: allPosts as Array<ChatCompletionMessageParam>,
        model: 'gpt-4o-mini',
        temperature: 0.7,
        frequency_penalty: 1.5,
        presence_penalty: 1.0,
        max_tokens: 700,
      });
      // model: 'deepseek-chat',

      const res = response.choices[0].message?.content.trim() || '';

      return { body: res };
    } catch (error) {
      console.log(error);
    }
  }

  //   getTrendingNews = async () => {
  //     try {
  //       //   const agent = new https.Agent({
  //       //     rejectUnauthorized: false, // This ignores the self-signed certificate error
  //       //   });
  //       const TrendingNews = await this.httpService.axiosRef.get(
  //         `https://caiyi.mooo.com/scrape-news/`,
  //         { timeout: 600000 }, // 10 minutes in milliseconds
  //       );
  //       if (TrendingNews.data.length > 0) {
  //         const newsList = TrendingNews.data;
  //         const allNews = await this.newsModel.find();
  //         let savedCount = 0; // To track how many news items are saved

  //         for (const newsItem of newsList) {
  //           const { title, source, date, link, body, image_url } = newsItem;

  //           // Check if the news with the same title and source already exists
  //           const exists = allNews.some(
  //             (existingNews) =>
  //               existingNews.title === title && existingNews.source === source,
  //           );

  //           if (!exists) {
  //             const summarizedBody = await this.caiyaAgent(body);
  //             const newNews = new this.newsModel({
  //               title,
  //               source,
  //               date,
  //               link,
  //               body: summarizedBody.body || body,
  //               image: image_url,
  //             });

  //             await newNews.save();
  //             savedCount++; // Increment the count for each saved news item
  //           }
  //         }

  //         // Return a summary message after processing all items
  //         return savedCount > 0
  //           ? `${savedCount} news items saved.`
  //           : 'No new news to save.';
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  getTrendingNews = async () => {
    try {
      const TrendingNews = await this.httpService.axiosRef.get(
        `https://caiyi.mooo.com/scrape-news/`,
        { timeout: 600000 }, // 10 minutes
      );

      if (TrendingNews.data.length > 0) {
        const newsList = TrendingNews.data;
        const savedNews = [];

        for (const newsItem of newsList) {
          const { title, source, date, link, body, image_url } = newsItem;

          // Optimized: Check directly in the DB instead of loading all news
          const exists = await this.newsModel.findOne({ title, source });

          if (!exists) {
            try {
              const summarizedBody = await this.caiyaAgent(body);

              const newNews = new this.newsModel({
                title,
                source,
                date,
                link,
                body: summarizedBody.body || body,
                image: image_url,
              });

              await newNews.save();
              savedNews.push(title); // Track saved news titles
            } catch (err) {
              console.error(`Failed to process news: ${title}`, err);
            }
          }
        }

        return savedNews.length > 0
          ? `${savedNews.length} news items saved: ${savedNews.join(', ')}`
          : 'No new news to save.';
      }
    } catch (error) {
      console.error('Error fetching trending news:', error);
    }
  };

  getParsedNews = async () => {
    try {
      const allNews = await this.newsModel.find();
      if (allNews) {
        return { trendingNews: allNews };
      }
      return {};
    } catch (error) {
      console.log(error);
    }
  };

  @Cron('0 * * * *')
  async handleCron(): Promise<void> {
    console.log('running cron');
    await this.getTrendingNews();
  }
}
