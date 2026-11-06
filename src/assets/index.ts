/**
 * The fixed Codex asset contract. These file names are the ONLY ones that exist.
 */
export const assets = {
  bgGame: require('../../assets/bg_game.png'),
  logo: require('../../assets/logo.png'),
  iconHome: require('../../assets/icon_home.png'),
  iconPause: require('../../assets/icon_pause.png'),
  sprite1: require('../../assets/sprite_1.png'),
  sprite2: require('../../assets/sprite_2.png'),
  sprite3: require('../../assets/sprite_3.png'),
  sprite4: require('../../assets/sprite_4.png'),
  sprite5: require('../../assets/sprite_5.png'),
};

/** sprite_1..sprite_5 act as the interchangeable "gift photo" tiles. */
export const giftSprites = [
  assets.sprite1,
  assets.sprite2,
  assets.sprite3,
  assets.sprite4,
  assets.sprite5,
];

export const spriteFor = (index: number) =>
  giftSprites[((index % giftSprites.length) + giftSprites.length) % giftSprites.length];

export default assets;
