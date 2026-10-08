import s from './SectionHead.module.css';

type Props = {
  index: number;
  label: string;
  title: string;
  intro?: string;
  id?: string;
};

/** Numbered eyebrow, big serif title that rises line by line, optional aside. */
export default function SectionHead({ index, label, title, intro, id }: Props) {
  return (
    <header className={s.head}>
      <p className="eyebrow" data-reveal="up">
        <b>({String(index).padStart(2, '0')})</b> {label}
      </p>
      <h2 className={s.title} id={id} data-reveal="lines">
        {title}
      </h2>
      {intro && (
        <p className={s.intro} data-reveal="up">
          {intro}
        </p>
      )}
    </header>
  );
}
