export interface PersonInfo {
  fullName: string;
  nickname: string;
  description: string;
  fatherName?: string;
  motherName?: string;
  instagram?: string;
  photo?: string;
}

export interface EventDetail {
  title: string;
  date: string;
  time: string;
  venue: string;
  address?: string;
  mapUrl?: string;
  calendarUrl?: string;
}

export interface QuoteInfo {
  arabic?: string;
  translation: string;
  source: string;
}

export interface GiftAccount {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}

export interface GiftAddress {
  recipientName: string;
  address: string;
  note?: string;
}

export interface AudioTrack {
  title: string;
  src: string;
  artist?: string;
  loop?: boolean;
  autoplay?: boolean;
}

export interface WeddingData {
  invitation: {
    title: string;
    subTitle: string;
    date: string;
    year: string;
    heroHeading: string;
  };
  recipient: {
    name: string;
    address: string;
    greeting: string;
    disclaimer: string;
  };
  couple: {
    heading?: string;
    subHeading?: string;
    groom: PersonInfo;
    bride: PersonInfo;
    primaryDisplay: string;
    monogram: {
      groomInitial: string;
      brideInitial: string;
      separator: string;
    };
  };
  quote: QuoteInfo;
  events: {
    akad: EventDetail;
    reception: EventDetail;
  };
  countdown: {
    targetDate: string; // ISO 8601 date string e.g. "2026-09-26T09:00:00+07:00"
    calendarTitle: string;
    calendarDetails: string;
    calendarUrl?: string;
  };
  gifts: {
    title?: string;
    subTitle?: string;
    intro?: string;
    accounts: GiftAccount[];
    physicalGift?: GiftAddress;
  };
  audio: AudioTrack;
  media: {
    coverImage: string;
    heroImage: string;
    heroVideo?: string;
    slideshow: string[];
    gallery: string[];
  };
}

export const weddingData: WeddingData = {
  invitation: {
    title: "Undangan",
    subTitle: "The Wedding of",
    date: "Sabtu, 26 September 2026",
    year: "2026",
    heroHeading: "The Wedding of",
  },
  recipient: {
    name: "Bpk. Ade Haiz & Ibu Hulayah",
    address: "Kp. Rumpak Sinang RT. 03/01 Kel. Pakulonan Barat Kec. Kelapa Dua, Tangerang",
    greeting: "Kepada Yth. Bapak/Ibu/Saudara/i",
    disclaimer: "Mohon maaf jika ada kesalahan nama/gelar",
  },
  couple: {
    heading: "We are Getting Married!",
    subHeading:
      "Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Ya Allah semoga ridho-Mu tercurah mengiringi pernikahan kami:",
    groom: {
      fullName: "Ahmad Reza Fahrudin",
      nickname: "Reza",
      description: "Putra Pertama Bpk. Ibrahim & Ibu Siti Rokayah",
      fatherName: "Ibrahim",
      motherName: "Siti Rokayah",
      instagram: "https://instagram.com",
      photo: "/images/prewedding_0xOm1cSHpdt6-683x1024.jpeg",
    },
    bride: {
      fullName: "Laila Nur A’immah",
      nickname: "Lela",
      description: "Putri Bungsu Bpk. Ade Haiz & Ibu Hulayah",
      fatherName: "Ade Haiz",
      motherName: "Hulayah",
      instagram: "https://instagram.com",
      photo: "/images/prewedding_0xOm1cSHpdt6-683x1024.jpeg",
    },
    primaryDisplay: "Lela & Reza",
    monogram: {
      groomInitial: "R",
      brideInitial: "L",
      separator: "&",
    },
  },
  quote: {
    arabic:
      "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ",
    translation:
      '"Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir."',
    source: "- QS. Ar-Rum : 21 -",
  },
  events: {
    akad: {
      title: "Akad Nikah",
      date: "Sabtu, 26 September 2026",
      time: "09.00 WIB s/d Selesai",
      venue: "Dikediaman Mempelai Wanita",
      address: "Kp. Rumpak Sinang RT. 03/01 Kel. Pakulonan Barat, Kec. Kelapa Dua, Tangerang",
      mapUrl:
        "https://www.google.com/maps/search/?api=1&query=Kp.+Rumpak+Sinang+RT.+03%2F01+Kel.+Pakulonan+Barat%2C+Kec.+Kelapa+Dua%2C+Tangerang",
    },
    reception: {
      title: "Resepsi Pernikahan",
      date: "Sabtu, 26 September 2026",
      time: "10.00 WIB s/d Selesai",
      venue: "Kp. Rumpak Sinang RT. 03/01 Kel. Pakulonan Barat Kec. Kelapa Dua, Tangerang",
      address: "Kp. Rumpak Sinang RT. 03/01 Kel. Pakulonan Barat, Kec. Kelapa Dua, Tangerang",
      mapUrl:
        "https://www.google.com/maps/search/?api=1&query=Kp.+Rumpak+Sinang+RT.+03%2F01+Kel.+Pakulonan+Barat%2C+Kec.+Kelapa+Dua%2C+Tangerang",
    },
  },
  countdown: {
    targetDate: "2026-09-26T09:00:00+07:00",
    calendarTitle: "The Wedding of Reza & Lela",
    calendarDetails: "Pernikahan Ahmad Reza Fahrudin & Laila Nur A’immah (Reza & Lela)",
    calendarUrl:
      "https://calendar.google.com/calendar/render?action=TEMPLATE&text=The+Wedding+of+Lela+%26+Reza&dates=20260926T020000Z/20260926T070000Z&details=Akad+Nikah+%26+Resepsi+Pernikahan+Lela+%26+Reza&location=Kp.+Rumpak+Sinang+RT.+03%2F01+Kel.+Pakulonan+Barat%2C+Kec.+Kelapa+Dua%2C+Tangerang",
  },
  gifts: {
    title: "Tanda Kasih",
    subTitle: "Wedding Gift",
    intro:
      "Tanpa mengurangi rasa hormat, bagi Bapak/Ibu/Saudara/i yang ingin memberikan tanda kasih untuk kami, dapat melalui:",
    accounts: [
      {
        bankName: "MANDIRI",
        accountNumber: "03123456789",
        accountHolder: "Ahmad Reza Fahrudin",
      },
      {
        bankName: "BCA",
        accountNumber: "03123456789",
        accountHolder: "Laila Nur A’immah",
      },
    ],
    physicalGift: {
      recipientName: "Laila Nur A’immah / Ahmad Reza Fahrudin",
      address: "Kp. Rumpak Sinang RT. 03/01 Kel. Pakulonan Barat, Kec. Kelapa Dua, Tangerang",
      note: "Silakan konfirmasi ke mempelai sebelum mengirimkan kado fisik.",
    },
  },
  audio: {
    title: "I Wanna Grow Old with You",
    artist: "Westlife",
    src: "https://inv.ridhoin.id/wp-content/uploads/2026/01/Westlife-I-Wanna-Grow-Old-with-You-Official-Audio-2.mp3",
    loop: true,
    autoplay: true,
  },
  media: {
    coverImage: "/images/gallery/prewed-1.jpg",
    heroImage: "/images/gallery/prewed-2.jpg",
    slideshow: [
      "/images/gallery/prewed-1.jpg",
      "/images/gallery/prewed-2.jpg",
      "/images/gallery/prewed-3.jpg",
      "/images/gallery/prewed-4.jpg",
    ],
    gallery: [
      "/images/gallery/prewed-1.jpg",
      "/images/gallery/prewed-2.jpg",
      "/images/gallery/prewed-3.jpg",
      "/images/gallery/prewed-4.jpg",
      "/images/gallery/prewed-5.jpg",
      "/images/gallery/prewed-6.jpg",
      "/images/gallery/prewed-7.jpg",
      "/images/gallery/prewed-8.jpg",
    ],
  },
};
