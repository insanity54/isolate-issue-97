import * as cheerio from 'cheerio'
import fetch from 'node-fetch'


export interface ChaturbateModel {
  gender: string;
  location: string;
  current_show: 'public' | 'private';
  username: string;
  room_subject: string;
  tags: string[];
  is_new: boolean;
  num_users: number;
  num_followers: number;
  country: string;
  spoken_languages: string;
  display_name: string;
  birthday: string;
  is_hd: boolean;
  age: number;
  seconds_online: number;
  image_url: string;
  image_url_360x270: string;
  chat_room_url_revshare: string;
  iframe_embed_revshare: string;
  chat_room_url: string;
  iframe_embed: string;
  slug: string;
}

export interface ChaturbateOnlineModelsResponse {
  results: ChaturbateModel[],
  count: number
}

export interface Room {
  name: string;
  url: string;
}

/**
 * 
 * @param {String} roomUrl     example: https://chaturbate.com/projektmelody
 * @returns {Object} initialRoomDossier
 */
export async function getInitialRoomDossier(roomUrl: string) {
  try {
    const res = await fetch(roomUrl, {
      headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
      }
    });
    const body = await res.text()
    const $ = cheerio.load(body);
    let rawScript = $('script:contains(window.initialRoomDossier)').html();
    if (!rawScript) {
      throw new Error('window.initialRoomDossier is null. This could mean the channel is in password mode');
    }
    let rawDossier = rawScript.slice(rawScript.indexOf('"'), rawScript.lastIndexOf('"') + 1);
    let dossier = JSON.parse(JSON.parse(rawDossier));

    return dossier;
  } catch (error) {
    if (error instanceof Error) {
      // Handle the error gracefully
      console.error(`Error fetching initial room dossier: ${error.message}`);
      return null; // Or any other appropriate action you want to take
    } else {
      console.error('caught an exotic error, uh-oh')
    }
  }
}



export async function getRandomRoom(): Promise<Room> {
  try {
    const res = await fetch('https://chaturbate.com/api/public/affiliates/onlinerooms/?wm=DiPkB&client_ip=request_ip', {
      headers: {
        accept: 'application/json'
      }
    });
    const data = await res.json() as ChaturbateOnlineModelsResponse;

    if (!data || !Array.isArray(data.results) || data.results.length === 0) {
      throw new Error('No results found');
    }

    const results = data.results;
    const randomIndex = Math.floor(Math.random() * results.length);

    if (!results[randomIndex]) {
      throw new Error('No result found at random index');
    }

    const username = results[randomIndex].username;
    return {
      url: `https://chaturbate.com/${username}`,
      name: username
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error in getRandomRoom: ${error.message}`);
    } else {
      console.error('An unexpected error occurred');
    }
    throw error; // Re-throw the error to propagate it further
  }
}