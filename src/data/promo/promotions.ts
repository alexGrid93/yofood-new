import type { IPromo } from '@/types/promo.ts'

import CoverJPG from '../../assets/promo/uziwa/cover.jpg';
import CoverWEBP from '../../assets/promo/uziwa/cover.webp';
import MountCoverWEBP from '../../assets/promo/uziwa/mount-fitzroy.webp';

export const promotions: IPromo[] = [
  {
    title: 'promotions_data.mount.title',
    subtitle: 'promotions_data.mount.subtitle',
    percentSale: 50,
    img: MountCoverWEBP,
    imgWebp: MountCoverWEBP,
    style: {
      gradientColor: 'hsl(0 0% 30% / 0)',
      color: 'white',
    },
  },
  {
    title: 'promotions_data.uziwa1.title',
    subtitle: 'promotions_data.uziwa1.subtitle',
    percentSale: 15,
    img: CoverJPG,
    imgWebp: CoverWEBP,
  },
  {
    title: 'promotions_data.uziwa2.title',
    subtitle: 'promotions_data.uziwa2.subtitle',
    percentSale: 5,
    img: CoverJPG,
    imgWebp: CoverWEBP,
  },
]
