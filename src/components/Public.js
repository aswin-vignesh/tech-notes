import { Link } from 'react-router-dom'

const Public = () => {

    const content = (
        <section className='public'>
            <header>
                <h1>Welcome to <span className='nowrap'>AV Notes MERN Application </span> </h1>
            </header>
            <main className="public__main">
                <p>I'm Full Stack Web Developer,and this is Full Stack Notes Application using MERN STACK  provides a trained staff ready to meet your tech repair needs.</p>
                <address className="public__addr">
                    Aswin Vignesh<br />
                    aswinvignesh7777@gmail.com<br />
                    credit : Dave Gray<br />
                </address>
                <br />
                <p>Owner: Aswin Vignesh</p>
            </main>
            <footer>
                <Link to="/login">Employee Login</Link>
            </footer>
        </section>
    )


  return content;
}

export default Public