type PageProps = { title: string; description: string };

export default function Page({ title, description }: PageProps) {
  return (
    <>
      <header className="page-header">
        <h1>{title}</h1>
        <p>{description}</p>
      </header>
      <section className="card">This section is ready for implementation.</section>
    </>
  );
}
