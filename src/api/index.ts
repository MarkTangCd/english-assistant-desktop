import { Configuration, OpenAIApi } from 'openai';
import { OPENAI_API_KEY } from '../config';

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY
});

export async function generateArticleOnWords(words: string[]) {
  const openai = new OpenAIApi(configuration);
  const completion = await openai.createCompletion({
    model: 'text-davinci-002',
    prompt: `Make up a story with these English words "${words.join()}"`,
    // prompt: 'Hello',
    max_tokens: 1000
  });

  return completion.data.choices.length > 0 && completion.data.choices[0].text ? completion.data.choices[0].text : '';
}