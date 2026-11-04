import type { Pet, PetOrder } from './types'

const request = async <T,>(url: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) }
  })
  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Request failed: ${response.status}`)
  }
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export const api = {
  pets: () => request<Pet[]>('/api/pets'),
  addPet: (pet: Omit<Pet, 'id'>) =>
    request<Pet>('/api/pets', { method: 'POST', body: JSON.stringify(pet) }),
  deletePet: (id: number) =>
    request<void>(`/api/pets/${id}`, { method: 'DELETE' }),
  orders: () => request<PetOrder[]>('/api/orders'),
  createOrder: (data: { customerName: string; petId: number; quantity: number }) =>
    request<PetOrder>('/api/orders', { method: 'POST', body: JSON.stringify(data) })
}
