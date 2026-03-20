export default function LoginPage() {
  return (
    <main className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="avatar-ring">
            <div className="avatar-core">🤖</div>
          </div>

          <h1 className="login-title">Iniciar sesión</h1>
          
        </div>

        <div className="login-body">
          <form className="login-form">
            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                type="email"
                placeholder="Ingresa tu correo"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                placeholder="Ingresa tu contraseña"
              />
            </div>

            <button type="submit" className="login-button">
              Entrar
            </button>

           <div className="login-links">
  {/* <a href="#">¿Olvidaste tu contraseña?</a> */}
  <a href="/register">Crear cuenta</a>
</div>
          </form>
        </div>
      </div>
    </main>
  );
}