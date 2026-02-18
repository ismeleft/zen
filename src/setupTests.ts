import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// 允許 getByRole 找到 aria-hidden 元素（例如裝飾性元件測試）
configure({ defaultHidden: true });
