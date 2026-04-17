import Gallery from "./Gallery";

export interface ActivityPhoto {
  id: string;
  image_url: string;
  organization: string | null;
  grade_class: string | null;
  activity_step: string | null;
  is_primary: boolean;
  gallery_slot: number | null;
}

export default async function GallerySection() {
  const slots: (ActivityPhoto | null)[] = [
    {
      id: "local-0",
      image_url: "/images/대표사진.png",
      organization: null,
      grade_class: null,
      activity_step: null,
      is_primary: true,
      gallery_slot: 0,
    },
    {
      id: "local-1",
      image_url: "/images/Group 4.png",
      organization: null,
      grade_class: null,
      activity_step: null,
      is_primary: false,
      gallery_slot: 1,
    },
    {
      id: "local-2",
      image_url: "/images/Group 5.png",
      organization: null,
      grade_class: null,
      activity_step: null,
      is_primary: false,
      gallery_slot: 2,
    },
    {
      id: "local-3",
      image_url: "/images/즐거운 사진.png",
      organization: null,
      grade_class: null,
      activity_step: null,
      is_primary: false,
      gallery_slot: 3,
    },
  ];

  return <Gallery photos={slots} />;
}
