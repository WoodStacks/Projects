export default function HomePage() {
  return (
    <div className="flex flex-col justify-center">
      <h2 className="mx-auto">Home Page</h2>
      <div className="max-w-[1000px] mx-auto">
        <h1>Sample Front-End Projects & Experiments</h1>

        <p>
          Welcome. This site is a collection of small, focused projects built
          with react to demonstrate practical front-end development skills. Each
          project emphasizes clean code, modern tooling, and thoughtful user
          experience. The site is hosted through GitHub Pages.
        </p>

        <h2 className="mt-[20px]">What This Site Is</h2>
        <p>
          This site serves as a lightweight portfolio showcasing modern React
          and TypeScript patterns, interactive UI components, and maintainable,
          performance-aware implementations.
        </p>

        <h2 className="mt-[20px]">How to Use It</h2>
        <p>
          Browse the projects to review individual implementations, explore the
          source code at{" "}
          <a
            href="https://github.com/WoodStacks/Projects"
            className="bg-blueunderline text-blue-600 hover:text-blue-800 visited:text-purple-600"
          >
            GitHub Projects
          </a>
          , and understand the technical decisions behind each feature. Each
          example is intentionally scoped to highlight specific skills.
        </p>

        <p className="mt-[20px]">
          <strong>
            Get started by selecting a project from the navigation.
          </strong>
        </p>
      </div>
    </div>
  );
}
