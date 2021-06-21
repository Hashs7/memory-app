import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import Duration from 'dayjs/plugin/duration';
import { InertiaPlugin } from '@/vendor/gsap/InertiaPlugin';

dayjs.locale('fr');
dayjs.extend(isSameOrBefore);
dayjs.extend(Duration);
gsap.registerPlugin(Draggable);
gsap.registerPlugin(InertiaPlugin);

export default async (ctx) => {
  await ctx.store.dispatch('nuxtClientInit', ctx);
};
