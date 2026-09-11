export default function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex items-start justify-between gap-6">
      <div>
        <h1 className="font-display text-3xl italic text-ink">{title}</h1>
        {subtitle && <p className="mt-1.5 max-w-md text-sm text-ink-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
