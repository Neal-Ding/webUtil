# git分支管理策略

## 分支命名及简介

1. 主版本分支(唯一):master，线上的每一个版本必须有对应的tag
2. 测试分支(唯一):test，提测正常的迭代需求
3. 紧急上线分支:onlineFixed，跳过流程紧急修复线上问题
4. 功能分支:以"feature_"开头，新功能开发用
5. 修复分支:以"fixed_"开头，现有功能修复用
6. 重构分支:以"refact_"开头，重构用

## 开发流程

1. 在每个项目中保证有且仅有一个master、test，并protect防删
2. 针对每个迭代需求，从最新test上新开feature开发，开发完成后提醒QA提测。完成后尤其是有多个分支需在test上重新回归(时机由QA决定)，回归时如果有问题，在原feature上提交再合并至test
3. test上回归完成后由开发提Merge Request合并到master，QA批准，QA上线
4. 各阶段中如果发现master有线上问题，由QA决定是否需要立刻修复。如需要则从master拉取fixed开发，完成后尤其是有多个分支需在onlineFixed上重新回归，回归完成后由开发提Merge Request合并到master，QA批准，QA上线

## 分支使用说明

1. onlineFixed需要时从master拉取，上线时合并到master，验证通过后合并到test，再删除onlineFixed
2. fixed需要时从test拉取可以合并到test跟随下一个迭代需求上线或者从master拉取合并到onlineFixed直接上线，以QA决策为准
3. 只有test和onlineFixed可以合并到master，而且必须通过Merge Request，由QA合并
4. 如果迭代过程中同时同模块提测多个分支，则按指定提测做临时分支，需注意修改仍提交在原分支上，临时分支要保持随时可删除状态
5.  如果test或master有错误合并不得强推，一定要通过revert commit，责任人在下次合并时须关注合并结果
6. feature和fixed可以互相合并
7. 所有分支合并必须使用--no-ff 保证提交点
8. 定期清理已上线分支
