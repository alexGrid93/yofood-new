interface IPromoStyle {
  gradientColor?: string;
  color?: string;
  titleColor?: string;
  subtitleColor?: string;
  percentColor?: string;
}

export interface IPromo {
  title: string
  subtitle: string
  percentSale: number
  img: string
  imgWebp: string
  style?: IPromoStyle
}
