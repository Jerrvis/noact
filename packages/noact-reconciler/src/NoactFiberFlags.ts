export type Flags = number

export const NoFlags = 0b0000000000000000000000 // 0
export const Placement = 0b0000000000000000000010 //2
export const Update = 0b0000000000000000000100 //4
export const ChildDelete = 0b0000000000000000001000 //3

export const MutationMask = Placement | Update
