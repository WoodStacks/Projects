export default function NotFoundPage() {
  return (
    <>
      <meta http-equiv="refresh" content="0; URL=./" />
      <title>Redirect</title>
      <div className="flex flex-col justify-center h-full">
        <div className="flex items-center max-w-[1000px] m-auto h-full mt-[20px]">
          <div className="flex flex-col">
            <h1 className="m-auto">Page Not Found</h1>
            <p className="m-auto">
              The link you followed to get here must be broken...
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
