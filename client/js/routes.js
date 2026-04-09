import { LoginView } from './views/login.js';
import { ClassSelectView } from './views/class-select.js';
import { HomeView } from './views/home.js';
import { DojoView } from './views/dojo.js';
import { DungeonsView } from './views/dungeons.js';
import { ShopView } from './views/shop.js';
import { PartyView } from './views/party.js';
import { CustomizeView } from './views/customize.js';
import { ProfileView } from './views/profile.js';

export const routes = [
  { path: '/', render: DojoView },
  { path: '/login', render: LoginView },
  { path: '/class', render: ClassSelectView },
  { path: '/home', render: HomeView },
  { path: '/dojo', render: DojoView },
  { path: '/dungeons', render: DungeonsView },
  { path: '/shop', render: ShopView },
  { path: '/party', render: PartyView },
  { path: '/customize', render: CustomizeView },
  { path: '/profile', render: ProfileView },
];


