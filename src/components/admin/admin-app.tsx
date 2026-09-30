<Field label="Часы RU">
          <Input
            value={contacts.hoursRu}
            onChange={(event) =>
              setContacts({ ...contacts, hoursRu: event.target.value })
            }
          />
        </Field>

        <Field label="Часы KZ">
          <Input
            value={contacts.hoursKz}
            onChange={(event) =>
              setContacts({ ...contacts, hoursKz: event.target.value })
            }
          />
        </Field>

        <Field label="Адрес ссылки на карту">
          <Input
            value={contacts.mapUrl}
            onChange={(event) =>
              setContacts({ ...contacts, mapUrl: event.target.value })
            }
          />
        </Field>

        <Field label="Базовое число учеников">
          <Input
            type="number"
            value={contacts.enrolledBase}
            onChange={(event) =>
              setContacts({
                ...contacts,
                enrolledBase: Number(event.target.value || 0),
              })
            }
          />
        </Field>
      </div>
    </div>
  );
}

function ToolsPanel({
  onChanged,
  onReset,
}: {
  onChanged: () => void;
  onReset: () => void;
}) {
  const [jsonText, setJsonText] = useState(() => exportSiteData());
  const [importText, setImportText] = useState("");

  function handleExportCopy() {
    navigator.clipboard.writeText(jsonText);
    toast.success("JSON скопирован в буфер обмена.");
  }

  function handleImport() {
    try {
      importSiteData(importText);
      setJsonText(exportSiteData());
      setImportText("");
      onChanged();
      toast.success("Данные успешно импортированы.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Ошибка импорта");
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl">Резервная копия и JSON</h1>
        <p className="mt-1 text-sm text-muted">
          Вы можете выгрузить все изменения в файл или импортировать их обратно.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-5">
          <h2 className="font-display text-lg">Экспорт данных</h2>
          <p className="mt-1 text-sm text-muted">
            Текущие настройки сайта в формате JSON.
          </p>

          <Textarea
            rows={10}
            readOnly
            value={jsonText}
            className="mt-4 font-mono text-xs"
          />

          <div className="mt-4 flex gap-2">
            <Button onClick={handleExportCopy}>Копировать JSON</Button>
            <Button
              variant="outline"
              onClick={() => setJsonText(exportSiteData())}
            }
          >
            Обновить
          </Button>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5">
          <h2 className="font-display text-lg">Импорт данных</h2>
          <p className="mt-1 text-sm text-muted">
            Вставьте JSON-код, чтобы восстановить настройки.
          </p>

          <Textarea
            rows={10}
            placeholder="Вставьте JSON сюда..."
            value={importText}
            onChange={(event) => setImportText(event.target.value)}
            className="mt-4 font-mono text-xs"
          />

          <div className="mt-4 flex gap-2">
            <Button onClick={handleImport}>Импортировать</Button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-danger/30 bg-surface p-5">
        <h2 className="font-display text-lg text-danger">Сброс настроек</h2>
        <p className="mt-1 text-sm text-muted">
          Вернуть сайт к исходному состоянию по умолчанию. Все изменения в
          браузере будут стерты.
        </p>

        <div className="mt-4">
          <Button variant="outline" onClick={onReset} className="text-danger">
            Сбросить всё до дефолта
          </Button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs text-muted">{label}</span>
      {children}
    </label>
  );
}
