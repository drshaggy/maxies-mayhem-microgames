// Microgame registry. To add a microgame: drop a module in this folder and
// import it here. (Submissions come in as PRs that add a file + this line.)
import fetchGame from './fetch.js';
import dodge from './dodge.js';
import chomp from './chomp.js';
import wag from './wag.js';
import stop from './stop.js';
import jump from './jump.js';
import catchGame from './catch.js';
import slice from './slice.js';
import launch from './launch.js';
import repeatGame from './repeat.js';
import balance from './balance.js';
import spot from './spot.js';
import sort from './sort.js';
import bark from './bark.js';
import climb from './climb.js';

export const MICROGAMES = [fetchGame, dodge, chomp, wag, stop, jump, catchGame, slice, launch, repeatGame, balance, spot, sort, bark, climb];
