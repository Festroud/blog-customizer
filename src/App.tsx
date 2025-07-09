import { CSSProperties, useState, useCallback } from 'react';
import clsx from 'clsx';

import { Article } from './components/article/Article';
import { ArticleParamsForm } from './components/article-params-form/ArticleParamsForm';
import { defaultArticleState, ArticleStateType } from './constants/articleProps';

import styles from './styles/index.module.scss';

const App = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [articleState, setArticleState] = useState<ArticleStateType>(defaultArticleState);

	// Применить новые настройки
	const handleApply = useCallback((newState: ArticleStateType) => {
		setArticleState(newState);
		setIsSidebarOpen(false);
	}, []);

	// Сбросить к дефолтным
	const handleReset = useCallback(() => {
		setArticleState(defaultArticleState);
		setIsSidebarOpen(false);
	}, []);

	return (
		<main
			className={clsx(styles.main)}
			style={
				{
					'--font-family': articleState.fontFamilyOption.value,
					'--font-size': articleState.fontSizeOption.value,
					'--font-color': articleState.fontColor.value,
					'--container-width': articleState.contentWidth.value,
					'--bg-color': articleState.backgroundColor.value,
				} as CSSProperties
			}
		>
			<ArticleParamsForm
				initialState={articleState}
				onApply={handleApply}
				onReset={handleReset}
			/>
			<Article />
		</main>
	);
};

export default App; 