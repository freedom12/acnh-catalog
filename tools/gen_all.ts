import { save } from './util';
import { genActivity } from './gen_activity';
import { genItem } from './gen_item';
import { genCreature } from './gen_creature';
import { genArtwork } from './gen_artwork';
import { genFossil } from './gen_fossil';
import { genMsgCard } from './gen_msg_card';
import { genMusic } from './gen_music';
import { genPlant } from './gen_plant';
import { genRecipe } from './gen_recipe';
import { genVillager } from './gen_villager';
import { genNpc } from './gen_npc';
import { genReaction } from './gen_reaction';
import { genConstruction } from './gen_construction';
import { genAchievement } from './gen_achievement';

const activitys = genActivity();
save(activitys, 'acnh-activitys.json');

const items = genItem();
save(items, 'acnh-items.json');

const villagers = genVillager(items);
save(villagers, 'acnh-villagers.json');

const npcs = genNpc();
save(npcs, 'acnh-npcs.json');

const recipes = genRecipe(items);
save(recipes, 'acnh-recipes.json');

const creatures = genCreature();
save(creatures, 'acnh-creatures.json');

const fossils = genFossil();
save(fossils, 'acnh-fossils.json');

const artworks = genArtwork();
save(artworks, 'acnh-artworks.json');

const plants = genPlant(items);
save(plants, 'acnh-plants.json');

const musics = genMusic();
save(musics, 'acnh-musics.json');

const reactions = genReaction();
save(reactions, 'acnh-reactions.json');

const constructions = genConstruction();
save(constructions, 'acnh-constructions.json');

const msgCards = genMsgCard();
save(msgCards, 'acnh-message-cards.json');

const achievements = genAchievement();
save(achievements, 'acnh-achievements.json');
