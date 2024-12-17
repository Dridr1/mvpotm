import axios from "axios";
import { delay } from "rxjs";
import { CreateSummonerDto } from "src/summoners/dto/create-summoner.dto";

const BASE_URL = "https://americas.api.riotgames.com";

type Config = {
    headers: {
        'X-Riot-Token': string
    }
}

export const config = (apiKey: string) => {
    return {headers: { 'X-Riot-Token': apiKey}}
};

export const fetchSummonerData = async (summonerDTO: CreateSummonerDto, config: Config) => {
    return await axios.get(`${BASE_URL}/riot/account/v1/accounts/by-riot-id/${summonerDTO.gameName}/${summonerDTO.tagLine}`, config);
}

export const fetchMatchesByPuuid = async (puuid: string, queue: number,config: Config) => {
    return await axios.get(`${BASE_URL}/lol/match/v5/matches/by-puuid/${puuid}/ids?startTime=1733367600&queue=${queue}&start=0&count=20`, config);
}

export const fechMatchDetails = async (matchId: string, config:Config) => {
    return await axios.get(`${BASE_URL}/lol/match/v5/matches/${matchId}`, config);
}