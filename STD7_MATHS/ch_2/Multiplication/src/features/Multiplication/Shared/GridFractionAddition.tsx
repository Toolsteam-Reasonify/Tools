import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

export function GridFractionAddition() {
  const { t } = useLanguage();
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gradient-to-r from-blue-200 to-purple-200">
      <div className="space-y-8">
        {/* 2x2 Grid Example: 1/4 + 1/4 = 2/4 */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">
            <span className="text-blue-600">1/4</span>
            <span className="text-gray-500 mx-2">+</span>
            <span className="text-purple-600">1/4</span>
            <span className="text-gray-500 mx-2">=</span>
            <span className="text-green-600">2×1/4</span>
          </h3>
          
          <div className="flex items-center justify-center space-x-6">
            {/* First 1/4 grid */}
            <div className="text-center">
              <div className="grid grid-cols-2 gap-1 w-24 h-24 border-2 border-blue-300 rounded-lg p-1">
                <div className="bg-blue-400 rounded"></div>
                <div className="border-2 border-dashed border-blue-300 rounded"></div>
                <div className="border-2 border-dashed border-blue-300 rounded"></div>
                <div className="border-2 border-dashed border-blue-300 rounded"></div>
              </div>
              <p className="text-sm font-bold text-blue-600 mt-2">1/4</p>
            </div>

            {/* Plus sign */}
            <div className="text-2xl font-bold text-gray-500">+</div>

            {/* Second 1/4 grid */}
            <div className="text-center">
              <div className="grid grid-cols-2 gap-1 w-24 h-24 border-2 border-purple-300 rounded-lg p-1">
                <div className="border-2 border-dashed border-purple-300 rounded"></div>
                <div className="bg-purple-400 rounded"></div>
                <div className="border-2 border-dashed border-purple-300 rounded"></div>
                <div className="border-2 border-dashed border-purple-300 rounded"></div>
              </div>
              <p className="text-sm font-bold text-purple-600 mt-2">1/4</p>
            </div>

            {/* Equals sign */}
            <div className="text-2xl font-bold text-gray-500">=</div>

            {/* Result 2/4 grid */}
            <div className="text-center">
              <div className="grid grid-cols-2 gap-1 w-24 h-24 border-2 border-green-300 rounded-lg p-1">
                <div className="bg-green-400 rounded"></div>
                <div className="bg-green-400 rounded"></div>
                <div className="border-2 border-dashed border-green-300 rounded"></div>
                <div className="border-2 border-dashed border-green-300 rounded"></div>
              </div>
              <p className="text-sm font-bold text-green-600 mt-2">2×1/4</p>
            </div>
          </div>
        </div>

        {/* 3x3 Grid Example: 2/9 + 1/9 + 2/9 = 5/9 */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">
            <span className="text-blue-600">2/9</span>
            <span className="text-gray-500 mx-2">+</span>
            <span className="text-purple-600">1/9</span>
            <span className="text-gray-500 mx-2">+</span>
            <span className="text-orange-600">2/9</span>
            <span className="text-gray-500 mx-2">=</span>
            <span className="text-green-600">5/9</span>
          </h3>
          
          <div className="flex items-center justify-center space-x-4">
            {/* First 2/9 grid */}
            <div className="text-center">
              <div className="grid grid-cols-3 gap-1 w-20 h-20 border-2 border-blue-300 rounded-lg p-1">
                <div className="bg-blue-400 rounded"></div>
                <div className="bg-blue-400 rounded"></div>
                <div className="border-2 border-dashed border-blue-300 rounded"></div>
                <div className="border-2 border-dashed border-blue-300 rounded"></div>
                <div className="border-2 border-dashed border-blue-300 rounded"></div>
                <div className="border-2 border-dashed border-blue-300 rounded"></div>
                <div className="border-2 border-dashed border-blue-300 rounded"></div>
                <div className="border-2 border-dashed border-blue-300 rounded"></div>
                <div className="border-2 border-dashed border-blue-300 rounded"></div>
              </div>
              <p className="text-sm font-bold text-blue-600 mt-2">2/9</p>
            </div>

            {/* Plus sign */}
            <div className="text-xl font-bold text-gray-500">+</div>

            {/* Second 1/9 grid */}
            <div className="text-center">
              <div className="grid grid-cols-3 gap-1 w-20 h-20 border-2 border-purple-300 rounded-lg p-1">
                <div className="border-2 border-dashed border-purple-300 rounded"></div>
                <div className="border-2 border-dashed border-purple-300 rounded"></div>
                <div className="border-2 border-dashed border-purple-300 rounded"></div>
                <div className="border-2 border-dashed border-purple-300 rounded"></div>
                <div className="bg-purple-400 rounded"></div>
                <div className="border-2 border-dashed border-purple-300 rounded"></div>
                <div className="border-2 border-dashed border-purple-300 rounded"></div>
                <div className="border-2 border-dashed border-purple-300 rounded"></div>
                <div className="border-2 border-dashed border-purple-300 rounded"></div>
              </div>
              <p className="text-sm font-bold text-purple-600 mt-2">1/9</p>
            </div>

            {/* Plus sign */}
            <div className="text-xl font-bold text-gray-500">+</div>

            {/* Third 2/9 grid */}
            <div className="text-center">
              <div className="grid grid-cols-3 gap-1 w-20 h-20 border-2 border-orange-300 rounded-lg p-1">
                <div className="border-2 border-dashed border-orange-300 rounded"></div>
                <div className="border-2 border-dashed border-orange-300 rounded"></div>
                <div className="border-2 border-dashed border-orange-300 rounded"></div>
                <div className="border-2 border-dashed border-orange-300 rounded"></div>
                <div className="border-2 border-dashed border-orange-300 rounded"></div>
                <div className="border-2 border-dashed border-orange-300 rounded"></div>
                <div className="bg-orange-400 rounded"></div>
                <div className="bg-orange-400 rounded"></div>
                <div className="border-2 border-dashed border-orange-300 rounded"></div>
              </div>
              <p className="text-sm font-bold text-orange-600 mt-2">2/9</p>
            </div>

            {/* Equals sign */}
            <div className="text-xl font-bold text-gray-500">=</div>

            {/* Result 5/9 grid */}
            <div className="text-center">
              <div className="grid grid-cols-3 gap-1 w-20 h-20 border-2 border-green-300 rounded-lg p-1">
                <div className="bg-green-400 rounded"></div>
                <div className="bg-green-400 rounded"></div>
                <div className="border-2 border-dashed border-green-300 rounded"></div>
                <div className="border-2 border-dashed border-green-300 rounded"></div>
                <div className="bg-green-400 rounded"></div>
                <div className="border-2 border-dashed border-green-300 rounded"></div>
                <div className="bg-green-400 rounded"></div>
                <div className="bg-green-400 rounded"></div>
                <div className="border-2 border-dashed border-green-300 rounded"></div>
              </div>
              <p className="text-sm font-bold text-green-600 mt-2">5/9</p>
            </div>
          </div>
        </div>

        {/* Explanation */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border-l-4 border-blue-500">
          <p className="text-gray-700 font-medium text-center">
            💡 {t('gridHint')}
          </p>
        </div>
      </div>
    </div>
  );
}
