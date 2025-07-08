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
	const [isOpen, setIsOpen] = useState(false);
	// Локальное состояние формы (draft)
	const [formState, setFormState] = useState<ArticleStateType>(initialState);

	// Сброс draft к initialState при открытии панели
	useEffect(() => {
		if (isOpen) {
			setFormState(initialState);
		}
	}, [isOpen, initialState]);

	// Обработчики изменений контролов
	const handleChange = <K extends keyof ArticleStateType>(key: K, value: ArticleStateType[K]) => {
		setFormState((prev) => ({ ...prev, [key]: value }));
	};

	// Обработка submit (применить)
	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		onApply(formState);
		setIsOpen(false);
	};

	// Обработка reset (сбросить)
	const handleReset = (e: FormEvent) => {
		e.preventDefault();
		onReset();
		setIsOpen(false);
	};

	// Клик вне сайдбара — закрыть (добавим обработчик на document, если открыт)
	useEffect(() => {
		if (!isOpen) return;
		const handleClickOutside = (e: MouseEvent) => {
			const sidebar = document.getElementById('sidebar-params-form');
			if (sidebar && !sidebar.contains(e.target as Node)) {
				setIsOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [isOpen]);

	const handleArrowClick = () => {
		setIsOpen((prev) => !prev);
	};

	return (
		<>
			<ArrowButton isOpen={isOpen} onClick={handleArrowClick} />
			{isOpen && (
				<aside
					className={`${styles.container} ${isOpen ? styles.container_open : ''}`}
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
			)}
		</>
	);
};
