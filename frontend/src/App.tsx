import { useEffect, useMemo, useState } from 'react'
import { PawPrint, Search, Plus, ShoppingBag, Trash2, Heart, Dog, Cat, Bird, X, RefreshCw } from 'lucide-react'
import { api } from './api'
import type { Pet, PetOrder } from './types'

const money = (value: number) => new Intl.NumberFormat('vi-VN', {
  style: 'currency', currency: 'VND', maximumFractionDigits: 0
}).format(value)

const speciesIcon = (species: string) => {
  const value = species.toLowerCase()
  if (value.includes('dog')) return <Dog size={22} />
  if (value.includes('bird')) return <Bird size={22} />
  return <Cat size={22} />
}

export default function App() {
  const [pets, setPets] = useState<Pet[]>([])
  const [orders, setOrders] = useState<PetOrder[]>([])
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<'pets' | 'orders'>('pets')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showPetForm, setShowPetForm] = useState(false)
  const [showOrderForm, setShowOrderForm] = useState<Pet | null>(null)
  const [petForm, setPetForm] = useState({ name: '', species: 'Cat', breed: '', price: '1000000', description: '' })
  const [customerName, setCustomerName] = useState('')

  const refresh = async () => {
    setLoading(true)
    setError('')
    try {
      const [petData, orderData] = await Promise.all([api.pets(), api.orders()])
      setPets(petData)
      setOrders(orderData)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Không thể tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void refresh() }, [])

  const filteredPets = useMemo(() => pets.filter(p =>
    `${p.name} ${p.species} ${p.breed || ''}`.toLowerCase().includes(search.toLowerCase())
  ), [pets, search])

  const submitPet = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      await api.addPet({
        ...petForm, price: Number(petForm.price), available: true, imageUrl: ''
      })
      setShowPetForm(false)
      setPetForm({ name: '', species: 'Cat', breed: '', price: '1000000', description: '' })
      await refresh()
    } catch (e) { setError(e instanceof Error ? e.message : 'Không thể thêm thú cưng') }
  }

  const submitOrder = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!showOrderForm) return
    try {
      await api.createOrder({ customerName, petId: showOrderForm.id, quantity: 1 })
      setShowOrderForm(null)
      setCustomerName('')
      setTab('orders')
      await refresh()
    } catch (e) { setError(e instanceof Error ? e.message : 'Không thể tạo đơn hàng') }
  }

  const deletePet = async (id: number) => {
    if (!window.confirm('Bạn có chắc muốn xóa thú cưng này?')) return
    try { await api.deletePet(id); await refresh() }
    catch (e) { setError(e instanceof Error ? e.message : 'Không thể xóa thú cưng') }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#"><span className="brand-mark"><PawPrint size={23} /></span><span>pet<span className="brand-accent">shop</span></span></a>
        <nav>
          <button className={tab === 'pets' ? 'nav-link active' : 'nav-link'} onClick={() => setTab('pets')}>Thú cưng</button>
          <button className={tab === 'orders' ? 'nav-link active' : 'nav-link'} onClick={() => setTab('orders')}>Đơn hàng</button>
        </nav>
        <button className="outline-button" onClick={() => void refresh()}><RefreshCw size={16} /> Làm mới</button>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow"><Heart size={14} fill="currentColor" /> YOUR PET, OUR PASSION</span>
            <h1>Tìm người bạn<br /><em>bốn chân</em> của bạn.</h1>
            <p>Những người bạn nhỏ đáng yêu đang chờ được gặp bạn. Khám phá và chọn người bạn đồng hành ngay hôm nay.</p>
            <button className="primary-button" onClick={() => { setTab('pets'); document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' }) }}>Khám phá ngay <span>→</span></button>
          </div>
          <div className="hero-art">
            <div className="sun-shape" />
            <div className="hero-emoji">🐶</div>
            <div className="floating-note note-one">♡ Best friend</div>
            <div className="floating-note note-two">Made with love</div>
            <div className="hero-paw"><PawPrint size={42} /></div>
          </div>
        </section>

        <section className="stats">
          <div><strong>{pets.length.toString().padStart(2, '0')}</strong><span>Thú cưng</span></div>
          <div><strong>{orders.length.toString().padStart(2, '0')}</strong><span>Đơn hàng</span></div>
          <div><strong>100%</strong><span>Yêu thương</span></div>
        </section>

        <section id="catalog" className="catalog-section">
          <div className="section-heading">
            <div><span className="eyebrow">OUR LITTLE FRIENDS</span><h2>{tab === 'pets' ? 'Các bé đang tìm nhà' : 'Đơn hàng của bạn'}</h2><p>{tab === 'pets' ? 'Chọn một người bạn phù hợp với gia đình bạn.' : 'Theo dõi những đơn hàng đã được tạo.'}</p></div>
            {tab === 'pets' && <button className="primary-button" onClick={() => setShowPetForm(true)}><Plus size={17} /> Thêm thú cưng</button>}
          </div>

          {error && <div className="error-banner">{error}<button onClick={() => setError('')}><X size={16} /></button></div>}
          {loading ? <div className="empty-state">Đang tải dữ liệu...</div> : tab === 'pets' ? <>
            <div className="toolbar"><div className="search-box"><Search size={18} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm theo tên, loài, giống..." /></div><span>{filteredPets.length} kết quả</span></div>
            <div className="pet-grid">
              {filteredPets.map((pet, index) => <article className="pet-card" key={pet.id}>
                <div className={`pet-visual visual-${index % 4}`}>
                  <span className="pet-type">{pet.species}</span>
                  <span className="pet-emoji">{pet.species.toLowerCase().includes('dog') ? '🐶' : pet.species.toLowerCase().includes('bird') ? '🐦' : '🐱'}</span>
                  <button className="favorite" aria-label="Yêu thích"><Heart size={17} /></button>
                </div>
                <div className="pet-info">
                  <div className="pet-title"><div><h3>{pet.name}</h3><p>{pet.breed || pet.species}</p></div><span className="species-icon">{speciesIcon(pet.species)}</span></div>
                  <p className="pet-description">{pet.description || 'Một người bạn nhỏ đáng yêu đang chờ bạn.'}</p>
                  <div className="pet-card-footer"><strong>{money(pet.price)}</strong><div><button className="icon-button danger" title="Xóa" onClick={() => void deletePet(pet.id)}><Trash2 size={16} /></button><button className="buy-button" disabled={!pet.available} onClick={() => setShowOrderForm(pet)}><ShoppingBag size={15} /> Nhận nuôi</button></div></div>
                </div>
              </article>)}
            </div>
            {filteredPets.length === 0 && <div className="empty-state">Chưa tìm thấy thú cưng phù hợp.</div>}
          </> : <div className="orders-list">
            {orders.map(order => <article className="order-row" key={order.id}><div className="order-icon"><ShoppingBag /></div><div className="order-main"><strong>Đơn hàng #{order.id}</strong><span>{order.customerName} · {order.pet?.name} · Số lượng: {order.quantity}</span></div><strong className="order-price">{money(order.totalPrice)}</strong></article>)}
            {orders.length === 0 && <div className="empty-state">Chưa có đơn hàng nào.</div>}
          </div>}
        </section>
      </main>

      <footer><a className="brand" href="#"><span className="brand-mark"><PawPrint size={19} /></span><span>pet<span className="brand-accent">shop</span></span></a><span>Made with love for every little friend.</span></footer>

      {showPetForm && <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setShowPetForm(false) }}><form className="modal" onSubmit={submitPet}>
        <button type="button" className="modal-close" onClick={() => setShowPetForm(false)}><X /></button><span className="eyebrow">NEW FRIEND</span><h2>Thêm thú cưng</h2>
        <label>Tên thú cưng<input required value={petForm.name} onChange={e => setPetForm({ ...petForm, name: e.target.value })} /></label>
        <div className="form-row"><label>Loài<select value={petForm.species} onChange={e => setPetForm({ ...petForm, species: e.target.value })}><option>Cat</option><option>Dog</option><option>Bird</option><option>Other</option></select></label><label>Giống<input value={petForm.breed} onChange={e => setPetForm({ ...petForm, breed: e.target.value })} /></label></div>
        <label>Giá (VND)<input type="number" min="0" required value={petForm.price} onChange={e => setPetForm({ ...petForm, price: e.target.value })} /></label>
        <label>Mô tả<textarea value={petForm.description} onChange={e => setPetForm({ ...petForm, description: e.target.value })} /></label>
        <button className="primary-button full" type="submit">Lưu thú cưng</button>
      </form></div>}

      {showOrderForm && <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setShowOrderForm(null) }}><form className="modal" onSubmit={submitOrder}>
        <button type="button" className="modal-close" onClick={() => setShowOrderForm(null)}><X /></button><span className="eyebrow">WELCOME HOME</span><h2>Đăng ký nhận nuôi</h2><p className="modal-intro">Bạn đang chọn bé <strong>{showOrderForm.name}</strong> – {money(showOrderForm.price)}.</p>
        <label>Tên người nhận nuôi<input required value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Nhập tên của bạn" /></label>
        <button className="primary-button full" type="submit">Xác nhận đơn hàng</button>
      </form></div>}
    </div>
  )
}
