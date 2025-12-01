
export const Hero = ({ title, subtitle }) => {

  return (
    <header className='hero'>
      <div className='container'>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
    </header>
  )
}