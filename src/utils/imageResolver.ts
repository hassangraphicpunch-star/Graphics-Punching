/**
 * Universal Image Path & Asset Resolver
 * Ensures all image paths (relative, imported, absolute, or filename-only)
 * resolve cleanly across development and production environments.
 */

import msDragonImg from '../assets/images/ms_dragon_embroidery_1787087913479.jpg';
import kingTigerMartialArtsImg from '../assets/images/king_tiger_martial_arts_embroidery_1787610892805.jpg';
import huntHorseHoundImg from '../assets/images/hunt_horse_hound_embroidery_1787610913777.jpg';
import kingTigerImg from '../assets/images/king_tiger_embroidery_1787087896562.jpg';
import banditCowboyImg from '../assets/images/bandit_cowboy_embroidery_1787606674472.jpg';
import dogOutlineImg from '../assets/images/dog_outline_embroidery_1787606697784.jpg';
import azTurfLandscapeImg from '../assets/images/az_turf_landscape_embroidery_1787254348932.jpg';
import breedersCupGoldImg from '../assets/images/breeders_cup_gold_embroidery_1787254367874.jpg';
import malakoffTigersImg from '../assets/images/malakoff_tigers_embroidery_1787254388435.jpg';
import modernDieselPerfImg from '../assets/images/modern_diesel_perf_embroidery_1787254407988.jpg';
import scottsTowingWreckerImg from '../assets/images/scotts_towing_wrecker_embroidery_1787254427840.jpg';
import betancourtDiceCherriesImg from '../assets/images/betancourt_dice_cherries_embroidery_1787180335506.jpg';
import bevraVintageRacingImg from '../assets/images/bevra_vintage_racing_embroidery_1787180345576.jpg';
import hollyJollyBarrelRaceImg from '../assets/images/holly_jolly_barrel_race_embroidery_1787180354979.jpg';
import theBarnJoyCreekImg from '../assets/images/the_barn_joy_creek_embroidery_1787180364512.jpg';
import fighterBeeImg from '../assets/images/fighter_bee_embroidery_1787166502000.jpg';
import flyingNitroImg from '../assets/images/flying_nitro_embroidery_1787166524293.jpg';
import tornadoesCrestImg from '../assets/images/tornadoes_crest_embroidery_1787166550084.jpg';
import dogHouseImg from '../assets/images/dog_house_embroidery_1787087934199.jpg';
import turkeySlayersImg from '../assets/images/turkey_slayers_embroidery_1787087952285.jpg';
import twoBearsImg from '../assets/images/two_bears_embroidery_1787087971119.jpg';
import freshLookImg from '../assets/images/fresh_look_embroidery_1787087880478.jpg';
import dezertwulfImg from '../assets/images/dezertwulf_embroidery_1787087863366.jpg';
import purpleHorseWrestlingImg from '../assets/images/purple_horse_wrestling_1787082542654.jpg';
import fortIrwinFirefightersImg from '../assets/images/fort_irwin_crest_1787605875058.jpg';
import bagleyFlyersImg from '../assets/images/bagley_flyers_vector_1787606356817.jpg';
import mcallenPoliceImg from '../assets/images/mcallen_police_badge_1787082488069.jpg';
import intlFallsLibraryImg from '../assets/images/intl_falls_library_vector_1787080604886.jpg';
import alfajoresCookiesImg from '../assets/images/alfajores_cookies_vector_1787080582084.jpg';
import backWoodsImg from '../assets/images/back_woods_vector_1787080020936.jpg';
import girlsWannaHaveFunImg from '../assets/images/girls_wanna_have_fun_color_sep_1787012045765.jpg';
import countryMarketFreshMeatsImg from '../assets/images/country_market_sweet_treats_1787080594066.jpg';
import northEasternUtilitiesImg from '../assets/images/northeastern_utilities_vector_1787011793570.jpg';
import stxArcheryImg from '../assets/images/stx_archery_emblem_1787082572809.jpg';
import thumbPrintLeafImg from '../assets/images/fingerprint_leaf_vector_1787082593385.jpg';
import arabiaHotRodsImg from '../assets/images/arabia_hot_rods_vector_1787079998691.jpg';
import catfishingHeroesImg from '../assets/images/catfishing_heroes_vector_1787080036259.jpg';
import littleforkElementaryImg from '../assets/images/littlefork_elementary_track_1787080614547.jpg';
import portCityBandImg from '../assets/images/port_city_band_logo_1787082507709.jpg';
import poweredByCommunityImg from '../assets/images/powered_by_community_shirt_1787082523357.jpg';

// Master lookup table by filename
const KNOWN_IMAGES_BY_FILENAME: Record<string, string> = {
  'ms_dragon_embroidery_1787087913479.jpg': msDragonImg,
  'king_tiger_martial_arts_embroidery_1787610892805.jpg': kingTigerMartialArtsImg,
  'hunt_horse_hound_embroidery_1787610913777.jpg': huntHorseHoundImg,
  'king_tiger_embroidery_1787087896562.jpg': kingTigerImg,
  'bandit_cowboy_embroidery_1787606674472.jpg': banditCowboyImg,
  'dog_outline_embroidery_1787606697784.jpg': dogOutlineImg,
  'az_turf_landscape_embroidery_1787254348932.jpg': azTurfLandscapeImg,
  'breeders_cup_gold_embroidery_1787254367874.jpg': breedersCupGoldImg,
  'malakoff_tigers_embroidery_1787254388435.jpg': malakoffTigersImg,
  'modern_diesel_perf_embroidery_1787254407988.jpg': modernDieselPerfImg,
  'scotts_towing_wrecker_embroidery_1787254427840.jpg': scottsTowingWreckerImg,
  'betancourt_dice_cherries_embroidery_1787180335506.jpg': betancourtDiceCherriesImg,
  'bevra_vintage_racing_embroidery_1787180345576.jpg': bevraVintageRacingImg,
  'holly_jolly_barrel_race_embroidery_1787180354979.jpg': hollyJollyBarrelRaceImg,
  'the_barn_joy_creek_embroidery_1787180364512.jpg': theBarnJoyCreekImg,
  'fighter_bee_embroidery_1787166502000.jpg': fighterBeeImg,
  'flying_nitro_embroidery_1787166524293.jpg': flyingNitroImg,
  'tornadoes_crest_embroidery_1787166550084.jpg': tornadoesCrestImg,
  'dog_house_embroidery_1787087934199.jpg': dogHouseImg,
  'turkey_slayers_embroidery_1787087952285.jpg': turkeySlayersImg,
  'two_bears_embroidery_1787087971119.jpg': twoBearsImg,
  'fresh_look_embroidery_1787087880478.jpg': freshLookImg,
  'dezertwulf_embroidery_1787087863366.jpg': dezertwulfImg,
  'purple_horse_wrestling_1787082542654.jpg': purpleHorseWrestlingImg,
  'fort_irwin_crest_1787605875058.jpg': fortIrwinFirefightersImg,
  'bagley_flyers_vector_1787606356817.jpg': bagleyFlyersImg,
  'mcallen_police_badge_1787082488069.jpg': mcallenPoliceImg,
  'intl_falls_library_vector_1787080604886.jpg': intlFallsLibraryImg,
  'alfajores_cookies_vector_1787080582084.jpg': alfajoresCookiesImg,
  'back_woods_vector_1787080020936.jpg': backWoodsImg,
  'girls_wanna_have_fun_color_sep_1787012045765.jpg': girlsWannaHaveFunImg,
  'country_market_sweet_treats_1787080594066.jpg': countryMarketFreshMeatsImg,
  'northeastern_utilities_vector_1787011793570.jpg': northEasternUtilitiesImg,
  'stx_archery_emblem_1787082572809.jpg': stxArcheryImg,
  'fingerprint_leaf_vector_1787082593385.jpg': thumbPrintLeafImg,
  'arabia_hot_rods_vector_1787079998691.jpg': arabiaHotRodsImg,
  'catfishing_heroes_vector_1787080036259.jpg': catfishingHeroesImg,
  'littlefork_elementary_track_1787080614547.jpg': littleforkElementaryImg,
  'port_city_band_logo_1787082507709.jpg': portCityBandImg,
  'powered_by_community_shirt_1787082523357.jpg': poweredByCommunityImg,
};

/**
 * Resolves any image path, filename, or URL to a valid, loadable asset URL.
 */
export function resolvePortfolioImageUrl(src?: string | null): string {
  if (!src || typeof src !== 'string' || !src.trim()) {
    return msDragonImg;
  }

  const cleanSrc = src.trim();

  // If it's already a base64 data URL, blob URL, or external absolute URL, return as-is
  if (
    cleanSrc.startsWith('data:') ||
    cleanSrc.startsWith('blob:') ||
    cleanSrc.startsWith('http://') ||
    cleanSrc.startsWith('https://')
  ) {
    return cleanSrc;
  }

  // Extract base filename to check against our master lookup table
  const filename = cleanSrc.split(/[/\\]/).pop() || '';
  if (filename && KNOWN_IMAGES_BY_FILENAME[filename]) {
    return KNOWN_IMAGES_BY_FILENAME[filename];
  }

  // If path starts with src/assets/images without leading slash, add leading slash
  if (cleanSrc.startsWith('src/assets/images/')) {
    return `/${cleanSrc}`;
  }

  // If path starts with assets/images without leading slash, add leading slash
  if (cleanSrc.startsWith('assets/images/')) {
    return `/${cleanSrc}`;
  }

  // If path starts with images/ without leading slash, add leading slash
  if (cleanSrc.startsWith('images/')) {
    return `/${cleanSrc}`;
  }

  // Default return normalized path
  return cleanSrc;
}

export function getFallbackPortfolioImage(): string {
  return msDragonImg;
}
