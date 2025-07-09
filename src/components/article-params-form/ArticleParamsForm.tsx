import { useEffect, useState, FormEvent } from 'react';
import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { Select } from 'src/ui/select/Select';
import { RadioGroup } from 'src/ui/radio-group/RadioGroup';
import { Separator } from 'src/ui/separator/Separator';
import {
	fontFamilyOptions,
	fontColors,
	backgroundColors,
	contentWidthArr,
	fontSizeOptions,
	ArticleStateType,
} from 'src/constants/articleProps';
import { Text } from 'src/ui/text/Text';
import { useClose } from 'src/hooks/useClose';
import { useRef } from 'react';
import clsx from 'clsx';

import styles from './ArticleParamsForm.module.scss';

export type ArticleParamsFormProps = {
	initialState: ArticleStateType;
	onApply: (state: ArticleStateType) => void;
	onReset: () => void;
};

export const ArticleParamsForm = ({
	initialState,
	onApply,
	onReset,
}: ArticleParamsFormProps) => {
	// Локальное состояние открытия сайдбара
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	// Локальное состояние формы (draft)
	const [formState, setFormState] = useState<ArticleStateType>(initialState);

	// Сброс draft к initialState при открытии панели
	useEffect(() => {
		if (isMenuOpen) {
			setFormState(initialState);
		}
	}, [isMenuOpen, initialState]);

	// Обработчики изменений контролов
	const handleChange = <K extends keyof ArticleStateType>(key: K, value: ArticleStateType[K]) => {
		setFormState((prev) => ({ ...prev, [key]: value }));
	};

	// Обработка submit (применить)
	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		onApply(formState);
		setIsMenuOpen(false);
	};

	// Обработка reset (сбросить)
	const handleReset = (e: FormEvent) => {
		e.preventDefault();
		onReset();
	};

	const sidebarRef = useRef<HTMLElement>(null);

	useClose({
		isOpen: isMenuOpen,
		onClose: () => setIsMenuOpen(false),
		rootRef: sidebarRef,
	});

	const handleArrowClick = () => {
		setIsMenuOpen((prev) => !prev);
	};

	return (
		<>
			<ArrowButton isOpen={isMenuOpen} onClick={handleArrowClick} />
			<aside
				ref={sidebarRef}
				className={clsx(styles.container, { [styles.container_open]: isMenuOpen })}
				id="sidebar-params-form"
			>
				<form className={styles.form} onSubmit={handleSubmit} onReset={handleReset}>
					<Text as="h2" weight={800} size={38} uppercase>
						ЗАДАЙТЕ ПАРАМЕТРЫ
					</Text>
					<div className={styles.headerGap}></div>
					<div className={styles.formBlock}>
						<Select
							title="Шрифт"
							options={fontFamilyOptions}
							selected={formState.fontFamilyOption}
							onChange={(option) => handleChange('fontFamilyOption', option)}
							placeholder="Выберите шрифт"
						/>
					</div>
					<div className={styles.formBlock}>
						<RadioGroup
							name="fontSizeOption"
							title="Размер шрифта"
							options={fontSizeOptions}
							selected={formState.fontSizeOption}
							onChange={(option) => handleChange('fontSizeOption', option)}
						/>
					</div>
					<div className={styles.formBlock}>
						<Select
							title="Цвет шрифта"
							options={fontColors}
							selected={formState.fontColor}
							onChange={(option) => handleChange('fontColor', option)}
							placeholder="Выберите цвет шрифта"
							unavailableValues={[formState.backgroundColor.value]}
						/>
						<Separator />
						<Select
							title="Цвет фона"
							options={backgroundColors}
							selected={formState.backgroundColor}
							onChange={(option) => handleChange('backgroundColor', option)}
							placeholder="Выберите цвет фона"
							unavailableValues={[formState.fontColor.value]}
						/>
					</div>
					<div className={styles.formBlock}>
						<Select
							title="Ширина контента"
							options={contentWidthArr}
							selected={formState.contentWidth}
							onChange={(option) => handleChange('contentWidth', option)}
							placeholder="Выберите ширину контента"
						/>
					</div>
					<div className={styles.bottomContainer}>
						<Button title='Сбросить' htmlType='reset' type='clear' />
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</>
	);
};
