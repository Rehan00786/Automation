export default function Dashboard() {
  return (
    <>
      <header className="page-header">
        <h1>Access dashboard</h1>
        <p>Overview of SAP access requests and approvals.</p>
      </header>
      <section className="stats" aria-label="Request summary">
        {[
          ["Open requests", "0"],
          ["Awaiting approval", "0"],
          ["Provisioning", "0"],
          ["Active clients", "0"],
        ].map(([label, value]) => (
          <article className="card" key={label}>
            <div className="stat-label">{label}</div>
            <div className="stat-value">{value}</div>
          </article>
        ))}
      </section>
      <p className="placeholder">Connect the API and database to see live request activity.</p>
    </>
  );
}
