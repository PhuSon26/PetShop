export type Pet = {
  id: number
  name: string
  species: string
  breed?: string
  price: number
  imageUrl?: string
  description?: string
  available: boolean
}

export type PetOrder = {
  id: number
  customerName: string
  pet: Pet
  quantity: number
  totalPrice: number
  createdAt: string
}
