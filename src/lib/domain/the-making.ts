import { z } from 'zod'

export const MakingStageSchema = z.object({
  id: z.string(),
  numberLabel: z.string(),
  title: z.string(),
  description: z.string(),
  imagePath: z.string(),
  isDarkPlate: z.boolean(),
})

export type MakingStage = z.infer<typeof MakingStageSchema>

export const makingStages: MakingStage[] = [
  {
    id: "drawing",
    numberLabel: "01",
    title: "The Drawing",
    description: "The deity set on a construction grid, proportion and ornament resolved by hand.",
    imagePath: "/assets/making/01-drawing.jpg",
    isDarkPlate: false
  },
  {
    id: "sculpt",
    numberLabel: "02",
    title: "The Sculpt",
    description: "The master model, the form pulled into three dimensions.",
    imagePath: "/assets/making/02-sculpt.jpg",
    isDarkPlate: false
  },
  {
    id: "cast",
    numberLabel: "03",
    title: "The Mould and the Cast",
    description: "Silver takes the shape for the first time, raw and unfinished.",
    imagePath: "/assets/making/03-cast.jpg",
    isDarkPlate: true
  },
  {
    id: "chasing",
    numberLabel: "04",
    title: "Chasing",
    description: "The detail cut back into the metal by hand.",
    imagePath: "/assets/making/04-chasing.jpg",
    isDarkPlate: true
  },
  {
    id: "polish",
    numberLabel: "05",
    title: "The Polish",
    description: "The surface brought to its presence.",
    imagePath: "/assets/making/05-polish.jpg",
    isDarkPlate: true
  },
  {
    id: "idol",
    numberLabel: "06",
    title: "The Idol",
    description: "The finished, consecrated piece.",
    imagePath: "/assets/making/06-idol.jpg",
    isDarkPlate: true
  }
]
