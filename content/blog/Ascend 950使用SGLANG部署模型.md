# Ascend 950使用SGLANG部署模型

# 环境配置

## 环境信息

Python：3.12

CANN版本：CANN9.1.0

Torch：2.10.0+cpu

TorchNPU：2.10.0.post6

SGLang：0.5.21+npu

sgl\_kernel\_npu：2026.9.0

hidevlab镜像：https://quay.io/repository/ascend/sglang

## 软链接Python

```Bash
ln -sf /usr/local/python3.12.16/bin/python3   /usr/local/bin/python3
ln -sf /usr/local/python3.12.16/bin/python3.12 /usr/local/bin/python3.12
```

## 安装libGL

```Plain Text
yum install -y mesa-libGL libglvnd-glx
```

## 安装OpenCV-headless

```Plain Text
pip install opencv-python-headless
```

## 安装Pytorch

```Plain Text
pip install torch==2.10 torchvision torchaudio==2.10 --index-url https://download.pytorch.org/whl/cpu
pip install torch-npu==2.10.post7
```

## 安装Triton-Ascend

```Plain Text
pip install triton-ascend==3.2.2 --extra-index-url=https://triton-ascend.osinfra.cn/pypi/simple
```

## 安装MemFabric

```Bash
pip install memfabric-hybrid==1.2.1
mfcli kernel install --soc-version A5
pip install memfabric-zbal==1.1.3
pip install memcache\_hybrid==1.2.1
```

## 安装SGL-Kernel

```Bash
git clone https://github.com/sgl-project/sgl-kernel-npu --depth 1
# 安装DeepEP
# A5: bash build.sh -a deepep Ascend950
# A3: bash build.sh -a deepep
# A2: bash build.sh -a deepep2
cd sgl-kernel-npu
bash build.sh -a deepep Ascend950

pip install output/deep\_ep-1.0.0+d9261669.cann.9.1.0.beta.3.b100-cp312-cp312-linux\_aarch64.whl

# 安装SGL-Kernel
bash build.sh -a kernels Ascend950
pip install output/sgl\_kernel\_npu-2026.9.0-cp312-cp312-linux\_aarch64.whl
```

## 从源码安装 SGLang

```Plain Text
git clone https://github.com/sgl-project/sglang.git --depth 1
cd sglang
mv python/pyproject\_npu.toml python/pyproject.toml
pip install -e python\[all\_npu]
```

# DeepSeek-V4-FLASH-0731

## 硬件信息

CPU：

```YAML
Architecture:             x86\_64
  CPU op-mode(s):         32-bit, 64-bit
  Address sizes:          52 bits physical, 57 bits virtual
  Byte Order:             Little Endian
CPU(s):                   256
  On-line CPU(s) list:    0-255
Vendor ID:                AuthenticAMD
  Model name:             AMD EPYC 9575F 64-Core Processor
    CPU family:           26
    Model:                2
    Thread(s) per core:   2
    Core(s) per socket:   64
    Socket(s):            2
    Stepping:             1
    Frequency boost:      enabled
    CPU max MHz:          5008.0068
    CPU min MHz:          1500.0000
    BogoMIPS:             6590.27
    Flags:                fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush mmx fxsr sse sse2 ht syscall nx 
                          mmxext fxsr\_opt pdpe1gb rdtscp lm constant\_tsc rep\_good amd\_lbr\_v2 nopl xtopology nonstop\_tsc cpuid extd\_apicid 
                          aperfmperf rapl pni pclmulqdq monitor ssse3 fma cx16 pcid sse4\_1 sse4\_2 x2apic movbe popcnt aes xsave avx f16c r
                          drand lahf\_lm cmp\_legacy svm extapic cr8\_legacy abm sse4a misalignsse 3dnowprefetch osvw ibs skinit wdt tce topo
                          ext perfctr\_core perfctr\_nb bpext perfctr\_llc mwaitx cpb cat\_l3 cdp\_l3 hw\_pstate ssbd mba perfmon\_v2 ibrs ibpb s
                          tibp ibrs\_enhanced vmmcall fsgsbase tsc\_adjust bmi1 avx2 smep bmi2 erms invpcid cqm rdt\_a avx512f avx512dq rdsee
                          d adx smap avx512ifma clflushopt clwb avx512cd sha\_ni avx512bw avx512vl xsaveopt xsavec xgetbv1 xsaves cqm\_llc c
                          qm\_occup\_llc cqm\_mbm\_total cqm\_mbm\_local avx\_vnni avx512\_bf16 clzero irperf xsaveerptr rdpru wbnoinvd amd\_ppin c
                          ppc arat npt lbrv svm\_lock nrip\_save tsc\_scale vmcb\_clean flushbyasid decodeassists pausefilter pfthreshold avic
                           v\_vmsave\_vmload vgif x2avic v\_spec\_ctrl vnmi idle\_hlt avx512vbmi umip pku ospke avx512\_vbmi2 gfni vaes vpclmulq
                          dq avx512\_vnni avx512\_bitalg avx512\_vpopcntdq la57 rdpid bus\_lock\_detect movdiri movdir64b overflow\_recov succor
                           smca fsrm avx512\_vp2intersect flush\_l1d debug\_swap csv3 prefetchi amd\_lbr\_pmc\_freeze tsa\_sq\_no tsa\_l1\_no abmc
Virtualization features:  
  Virtualization:         AMD-V
Caches (sum of all):      
  L1d:                    6 MiB (128 instances)
  L1i:                    4 MiB (128 instances)
  L2:                     128 MiB (128 instances)
  L3:                     512 MiB (16 instances)
NUMA:                     
  NUMA node(s):           2
  NUMA node0 CPU(s):      0-63,128-191
  NUMA node1 CPU(s):      64-127,192-255
Vulnerabilities:          
  Gather data sampling:   Not affected
  Itlb multihit:          Not affected
  L1tf:                   Not affected
  Mds:                    Not affected
  Meltdown:               Not affected
  Mmio stale data:        Not affected
  Reg file data sampling: Not affected
  Retbleed:               Not affected
  Spec rstack overflow:   Not affected
  Spec store bypass:      Mitigation; Speculative Store Bypass disabled via prctl
  Spectre v1:             Mitigation; usercopy/swapgs barriers and \_\_user pointer sanitization
  Spectre v2:             Vulnerable: eIBRS with unprivileged eBPF
  Srbds:                  Not affected
  Tsa:                    Not affected
  Tsx async abort:        Not affected
  Vmscape:                Not affected
```

NPU：4\*Ascend950PR

```YAML
+-------------------------------------------------------------------------------------------------+
| npu-smi 25.7.rc1.10                              Version: 25.7.rc1.10                           |
+--------+------------------+---------------+-----------------------------------------------------+
| NPU ID | Name             | Health        | Power(W)    Temp(C)           Hugepages-Usage(page) |
|        |                  | Bus-Id        | NPU Util(%) Memory-Usage(MB)  HBM-Usage(MB)         |
+========+==================+===============+=====================================================+
| 0      | Ascend950PR      | OK            | 204.6       59                0     / 0             |
|        |                  | 0000:0D:00.0  | 0           0    / 0          5241  / 131072        |
+========+==================+===============+=====================================================+
| 1      | Ascend950PR      | OK            | 205.0       56                0     / 0             |
|        |                  | 0000:0E:00.0  | 0           0    / 0          5237  / 131072        |
+========+==================+===============+=====================================================+
| 2      | Ascend950PR      | OK            | 201.3       57                0     / 0             |
|        |                  | 0000:57:00.0  | 0           0    / 0          5237  / 131072        |
+========+==================+===============+=====================================================+
| 3      | Ascend950PR      | OK            | 210.5       56                0     / 0             |
|        |                  | 0000:55:00.0  | 0           0    / 0          5237  / 131072        |
+========+==================+===============+=====================================================+
+---------------------------+---------------+-----------------------------------------------------+
| NPU ID                    | Process id    | Process name             | Process memory(MB)       |
+===========================+===============+=====================================================+
| No running processes found in NPU 0                                                             |
+===========================+===============+=====================================================+
| No running processes found in NPU 1                                                             |
+===========================+===============+=====================================================+
| No running processes found in NPU 2                                                             |
+===========================+===============+=====================================================+
| No running processes found in NPU 3                                                             |
+===========================+===============+=====================================================+
```

## 部署模型

### 部署命令

```Bash
# ============================================================
# Before running, update the following variable:
#   MODEL\_PATH: path to the model weights directory
# ============================================================

MODEL\_PATH=/workspace/shared\_assets/OssSGLangMeetup/model/DeepSeek-V4-Flash-0731

MODEL\_PATH=/home/openmind/models/DeepSeek-V4-Flash-0731
source /usr/local/Ascend/ascend-toolkit/latest/set\_env.sh
source /usr/local/Ascend/nnal/atb/set\_env.sh
source /usr/local/Ascend/ascend-toolkit/latest/opp/vendors/customize/bin/set\_env.bash
source /usr/local/Ascend/ascend-toolkit/latest/opp/vendors/custom\_transformer/bin/set\_env.bash

export ASCEND\_CUSTOM\_OPP\_PATH=/usr/local/Ascend/extra-ops/vendors/custom\_transformer/:$ASCEND\_CUSTOM\_OPP\_PATH
export DEEPEP\_HCCL\_BUFFSIZE=1600
export DEEPEP\_NORMAL\_COMBINE\_ENABLE\_LONG\_SEQ=1
export DEEPEP\_NORMAL\_LONG\_SEQ\_PER\_ROUND\_TOKENS=2048
export DEEPEP\_NORMAL\_LONG\_SEQ\_ROUND=16
export FORCE\_DRAFT\_MODEL\_NON\_QUANT=1
export LD\_LIBRARY\_PATH=/usr/local/Ascend/extra-ops/vendors/custom\_transformer/op\_api/lib:$LD\_LIBRARY\_PATH
export PYTORCH\_NPU\_ALLOC\_CONF=expandable\_segments:True
export SGLANG\_DEEPEP\_NUM\_MAX\_DISPATCH\_TOKENS\_PER\_RANK=160
export SGLANG\_DSPARK\_A5\_EXTRA\_OPS\_SO=/usr/local/Ascend/extra-ops/vllm\_ascend\_C.cpython-312-x86\_64-linux-gnu.so
export SGLANG\_DSPARK\_FAST\_KERNEL=0
export SGLANG\_ENABLE\_OVERLAP\_PLAN\_STREAM=1
export SGLANG\_ENABLE\_SPEC\_V2=1
export SGLANG\_ENABLE\_WAR\_BARRIER=1
export SGLANG\_FORCE\_COARSE\_WAR\_BARRIER=1
export SGLANG\_OPT\_BF16\_FP32\_GEMM\_ALGO=torch
export SGLANG\_OPT\_DEEPGEMM\_HC\_PRENORM=False
export SGLANG\_OPT\_FP8\_WO\_A\_GEMM=False
export SGLANG\_OPT\_FUSE\_WQA\_WKV=0
export SGLANG\_OPT\_USE\_FUSED\_HASH\_TOPK=False
export SGLANG\_OPT\_USE\_OVERLAP\_STORE\_CACHE=False
export SGLANG\_OPT\_USE\_TILELANG\_MHC\_POST=False
export SGLANG\_OPT\_USE\_TILELANG\_MHC\_PRE=False
export SGLANG\_SET\_CPU\_AFFINITY=1
export STREAMS\_PER\_DEVICE=32

python -m sglang.launch\_server \\
    --model-path "${MODEL\_PATH}" \\
    --page-size 128 \\
    --tp-size 4 \\
    --trust-remote-code \\
    --device npu \\
    --attention-backend dsv4 \\
    --watchdog-timeout 9000 \\
    --host 127.0.0.1 --port 6688 \\
    --mem-fraction-static 0.72 \\
    --max-running-requests 64 \\
    --chunked-prefill-size 65536 \\
    --max-prefill-tokens 65536 \\
    --cuda-graph-bs-decode 1 2 4 8 16 \\
    --enable-dp-lm-head \\
    --disable-radix-cache \\
    --enable-dp-attention --dp-size 4 \\
    --reasoning-parser deepseek-v4 \\
    --speculative-algorithm DSPARK \\
    --speculative-draft-attention-backend ascend \\
    --speculative-num-draft-tokens 6 \\
    --speculative-dspark-block-size 5 \\
    --quantization modelslim
```

### 对话测试

```C++
# ============================================================
# Before running, update the following variables:
#   HOST: the server host address (e.g., localhost)
#   PORT: the server port number (e.g., 6688)
# ============================================================

curl http://127.0.0.1:6688/v1/chat/completions \\
    -H "Content-Type: application/json" \\
    -d '{
        "model": "deepseek-v4-flash",
        "messages": \[{"role": "user", "content": "简单讲述一下华为昇腾950PR这个算力?"}]
    }'
```

运行结果

!\[Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=ZDJkNTQ0OTU1ZGMwN2M0YWU1YmRkMzQzOTY0ZmViMWZfNGY5OGNhZDZmNTE2OTE3NTY4MWNmN2E3MGZhOWYzM2RfSUQ6NzcwNzgyMzg3ODcxMzkwNDEyMV8xNzk1MzM3MzgzOjE3OTU0MjM3ODNfVjM)

## 性能调优

### TPOT<=50ms

#### 部署命令

```Plain Text
MODEL\_PATH=/workspace/shared\_assets/OssSGLangMeetup/model/DeepSeek-V4-Flash-0731

source /usr/local/Ascend/ascend-toolkit/latest/set\_env.sh
source /usr/local/Ascend/nnal/atb/set\_env.sh
source /usr/local/Ascend/ascend-toolkit/latest/opp/vendors/customize/bin/set\_env.bash
source /usr/local/Ascend/ascend-toolkit/latest/opp/vendors/custom\_transformer/bin/set\_env.bash

export ASCEND\_CUSTOM\_OPP\_PATH=/usr/local/Ascend/extra-ops/vendors/custom\_transformer/:$ASCEND\_CUSTOM\_OPP\_PATH
export DEEPEP\_HCCL\_BUFFSIZE=1600
export DEEPEP\_NORMAL\_COMBINE\_ENABLE\_LONG\_SEQ=1
export DEEPEP\_NORMAL\_LONG\_SEQ\_PER\_ROUND\_TOKENS=2048
export DEEPEP\_NORMAL\_LONG\_SEQ\_ROUND=16
export FORCE\_DRAFT\_MODEL\_NON\_QUANT=1
export INF\_NAN\_MODE\_FORCE\_DISABLE=1
export LD\_LIBRARY\_PATH=/usr/local/Ascend/extra-ops/vendors/custom\_transformer/op\_api/lib:$LD\_LIBRARY\_PATH
export PYTORCH\_NPU\_ALLOC\_CONF=expandable\_segments:True
export SGLANG\_DEEPEP\_NUM\_MAX\_DISPATCH\_TOKENS\_PER\_RANK=32
export SGLANG\_DSPARK\_A5\_EXTRA\_OPS\_SO=/usr/local/Ascend/extra-ops/vllm\_ascend\_C.cpython-312-x86\_64-linux-gnu.so
export SGLANG\_DSPARK\_FAST\_KERNEL=0
export SGLANG\_ENABLE\_OVERLAP\_PLAN\_STREAM=1
export SGLANG\_ENABLE\_SPEC\_V2=1
export SGLANG\_ENABLE\_WAR\_BARRIER=1
export SGLANG\_FORCE\_COARSE\_WAR\_BARRIER=1
export SGLANG\_NPU\_USE\_MULTI\_STREAM=1
export SGLANG\_OPT\_BF16\_FP32\_GEMM\_ALGO=torch
export SGLANG\_OPT\_DEEPGEMM\_HC\_PRENORM=False
export SGLANG\_OPT\_FP8\_WO\_A\_GEMM=False
export SGLANG\_OPT\_FUSE\_WQA\_WKV=0
export SGLANG\_OPT\_USE\_FUSED\_HASH\_TOPK=False
export SGLANG\_OPT\_USE\_OVERLAP\_STORE\_CACHE=False
export SGLANG\_OPT\_USE\_TILELANG\_MHC\_POST=False
export SGLANG\_OPT\_USE\_TILELANG\_MHC\_PRE=False
export SGLANG\_SET\_CPU\_AFFINITY=1
export STREAMS\_PER\_DEVICE=32

echo performance | tee /sys/devices/system/cpu/cpu\*/cpufreq/scaling\_governor
sysctl -w vm.swappiness=0
sysctl -w kernel.numa\_balancing=0
sysctl -w kernel.sched\_migration\_cost\_ns=50000

python -m sglang.launch\_server \\
    --model-path "${MODEL\_PATH}" \\
    --page-size 128 \\
    --tp-size 4 \\
    --trust-remote-code \\
    --device npu \\
    --attention-backend dsv4 \\
    --watchdog-timeout 9000 \\
    --host 127.0.0.1 --port 6688 \\
    --mem-fraction-static 0.72 \\
    --max-running-requests 16 \\
    --chunked-prefill-size 32768 \\
    --max-prefill-tokens 32768 \\
    --cuda-graph-bs-decode 1 2 4 6 8 \\
    --enable-dp-lm-head \\
    --enable-dp-attention --dp-size 4 \\
    --moe-a2a-backend deepep \\
    --deepep-mode auto \\
    --reasoning-parser deepseek-v4 \\
    --speculative-algorithm DSPARK \\
    --speculative-draft-attention-backend ascend \\
    --speculative-num-draft-tokens 6 \\
    --speculative-dspark-block-size 5
```

**相对原命令的改动及依据**

|参数|原值|新值|原因|
|-|-|-|-|
|`--disable-radix-cache`|开启|删除|90% 共享前缀必须靠 radix cache 命中；关闭后每条请求全量 prefill 128k，用例失真|
|`SGLANG\_DEEPEP\_NUM\_MAX\_DISPATCH\_TOKENS\_PER\_RANK`|160|32|官方公式：per-rank 并发 × draft = (16/4)×6 = 24，32 留余量；160 每步 padding，抬高 TPOT|
|`--max-running-requests`|64|16|128k KV 占用大；dp4 下每 rank 4 并发，TPOT 更稳|
|`--chunked-prefill-size`|65536|32768|长 prefill 切片，减少对 decode 的阻塞；降低激活显存|
|`--max-prefill-tokens`|65536|32768|与 chunk 对齐；90% 命中后实际仅约 12800 token，单批完成|
|`--cuda-graph-bs-decode`|1 2 4 8 16|1 2 4 6 8|按 per-rank 4 并发覆盖并留扫描余量，减少 graph 捕获显存|
|`SGLANG\_NPU\_USE\_MULTI\_STREAM`|未设|1|官方 DeepSeek-V4-Flash 配置项，共享专家与路由专家重叠执行|
|`--moe-a2a-backend` / `--deepep-mode`|未显式|deepep / auto|对齐官方 V4-Flash 8P 混合部署配置|
|`INF\_NAN\_MODE\_FORCE\_DISABLE`|未设|1|官方 V4-Flash 配置项，关闭 INF/NAN 检查开销|

#### 精度测试

```Bash
pip install sgl-eval
sgl-eval run gsm8k \\
 --model /workspace/shared\_assets/OssSGLangMeetup/model/DeepSeek-V4-Flash-0731 \\
 --base-url http://127.0.0.1:6688/v1 \\
 --num-examples 10 --max-tokens 2048
```

运行结果

```Plain Text
Run directory: /root/.sgl\_eval/sgl\_eval\_gsm8k\_20261114-132022
gsm8k: 100%|█████████████████████████████████████████████████████████████████████████████████| 10/10 \[00:09<00:00,  1.10it/s, acc=100.00%, truncated=0/10 (0.00%)]
== gsm8k ==
10 examples (single-shot)  |  9.1s  |  111 tok/s  |  1K tokens

\* score                =  100.00%
  stop\_rate            =  100.00%
  truncated\_rate       =  0.00%
  error\_rate           =  0.00%
  avg\_input\_tokens     =  86.7 tokens
  avg\_output\_tokens    =  101.1 tokens
  avg\_thinking\_tokens  =  0.0 tokens

Metrics: /root/.sgl\_eval/sgl\_eval\_gsm8k\_20261114-132022/metrics.json
Predictions: /root/.sgl\_eval/sgl\_eval\_gsm8k\_20261114-132022  (1 jsonl file(s))
```

#### 性能测试

```Bash
python -m sglang.benchmark.serving \\
    --dataset-name generated-shared-prefix \\
    --backend sglang \\
    --host 127.0.0.1 \\
    --port 6688 \\
    --gsp-num-groups 1 \\
    --gsp-prompts-per-group 64 \\
    --gsp-system-prompt-len 115200 \\
    --gsp-question-len 12800 \\
    --gsp-output-len 1000 \\
    --max-concurrency 16 \\
    --num-prompts 64 \\
    --warmup-requests 8 \\
    --request-rate inf \\
    --seed 1
```

完整报告

```Java
============ Serving Benchmark Result ============
Backend:                                 sglang    
Traffic request rate:                    inf       
Max request concurrency:                 16        
Successful requests:                     64        
Benchmark duration (s):                  197.33    
Total input tokens:                      8374342   
Total input text tokens:                 8374342   
Total generated tokens:                  64000     
Total generated tokens (retokenized):    63898     
Request throughput (req/s):              0.32      
Input token throughput (tok/s):          42439.21  
Output token throughput (tok/s):         324.34    
Peak output token throughput (tok/s):    2360.00   
Peak concurrent requests:                23        
Total token throughput (tok/s):          42763.55  
Concurrency:                             15.40     
Accept length:                           5.72      
----------------End-to-End Latency----------------
Mean E2E Latency (ms):                   47479.15  
Median E2E Latency (ms):                 37199.86  
P90 E2E Latency (ms):                    78724.05  
P95 E2E Latency (ms):                    99077.61  
P99 E2E Latency (ms):                    108139.60 
---------------Time to First Token----------------
Mean TTFT (ms):                          15832.93  
Median TTFT (ms):                        8910.36   
P90 TTFT (ms):                           40502.43  
P95 TTFT (ms):                           40510.61  
P99 TTFT (ms):                           40519.32  
-----Time per Output Token (excl. 1st token)------
Mean TPOT (ms):                          31.68     
Median TPOT (ms):                        26.48     
P90 TPOT (ms):                           52.23     
P95 TPOT (ms):                           62.45     
P99 TPOT (ms):                           90.72     
---------------Inter-Token Latency----------------
Mean ITL (ms):                           31.70     
Median ITL (ms):                         6.85      
P90 ITL (ms):                            10.52     
P95 ITL (ms):                            58.55     
P99 ITL (ms):                            664.02    
Max ITL (ms):                            27724.73  
==================================================
```

### TPOT<=20ms

#### 部署命令

```Bash
MODEL\_PATH=/workspace/shared\_assets/OssSGLangMeetup/model/DeepSeek-V4-Flash-0731

source /usr/local/Ascend/ascend-toolkit/latest/set\_env.sh
source /usr/local/Ascend/nnal/atb/set\_env.sh
source /usr/local/Ascend/ascend-toolkit/latest/opp/vendors/customize/bin/set\_env.bash
source /usr/local/Ascend/ascend-toolkit/latest/opp/vendors/custom\_transformer/bin/set\_env.bash

export ASCEND\_CUSTOM\_OPP\_PATH=/usr/local/Ascend/extra-ops/vendors/custom\_transformer/:$ASCEND\_CUSTOM\_OPP\_PATH
export DEEPEP\_HCCL\_BUFFSIZE=1600
export DEEPEP\_NORMAL\_COMBINE\_ENABLE\_LONG\_SEQ=1
export DEEPEP\_NORMAL\_LONG\_SEQ\_PER\_ROUND\_TOKENS=2048
export DEEPEP\_NORMAL\_LONG\_SEQ\_ROUND=16
export FORCE\_DRAFT\_MODEL\_NON\_QUANT=1
export INF\_NAN\_MODE\_FORCE\_DISABLE=1
export LD\_LIBRARY\_PATH=/usr/local/Ascend/extra-ops/vendors/custom\_transformer/op\_api/lib:$LD\_LIBRARY\_PATH
export PYTORCH\_NPU\_ALLOC\_CONF=expandable\_segments:True
export SGLANG\_DEEPEP\_NUM\_MAX\_DISPATCH\_TOKENS\_PER\_RANK=16
export SGLANG\_DSPARK\_A5\_EXTRA\_OPS\_SO=/usr/local/Ascend/extra-ops/vllm\_ascend\_C.cpython-312-x86\_64-linux-gnu.so
export SGLANG\_DSPARK\_FAST\_KERNEL=0
export SGLANG\_ENABLE\_OVERLAP\_PLAN\_STREAM=1
export SGLANG\_ENABLE\_SPEC\_V2=1
export SGLANG\_ENABLE\_WAR\_BARRIER=1
export SGLANG\_FORCE\_COARSE\_WAR\_BARRIER=1
export SGLANG\_NPU\_USE\_MULTI\_STREAM=1
export SGLANG\_OPT\_BF16\_FP32\_GEMM\_ALGO=torch
export SGLANG\_OPT\_DEEPGEMM\_HC\_PRENORM=False
export SGLANG\_OPT\_FP8\_WO\_A\_GEMM=False
export SGLANG\_OPT\_FUSE\_WQA\_WKV=0
export SGLANG\_OPT\_USE\_FUSED\_HASH\_TOPK=False
export SGLANG\_OPT\_USE\_OVERLAP\_STORE\_CACHE=False
export SGLANG\_OPT\_USE\_TILELANG\_MHC\_POST=False
export SGLANG\_OPT\_USE\_TILELANG\_MHC\_PRE=False
export SGLANG\_SET\_CPU\_AFFINITY=1
export STREAMS\_PER\_DEVICE=32

# 主机侧抖动抑制（官方 batch checklist：always）
echo performance | tee /sys/devices/system/cpu/cpu\*/cpufreq/scaling\_governor
sysctl -w vm.swappiness=0
sysctl -w kernel.numa\_balancing=0
sysctl -w kernel.sched\_migration\_cost\_ns=50000

python -m sglang.launch\_server \\
    --model-path "${MODEL\_PATH}" \\
    --page-size 128 \\
    --tp-size 4 \\
    --trust-remote-code \\
    --device npu \\
    --attention-backend dsv4 \\
    --watchdog-timeout 9000 \\
    --host 127.0.0.1 --port 6688 \\
    --mem-fraction-static 0.72 \\
    --max-running-requests 8 \\
    --chunked-prefill-size 32768 \\
    --max-prefill-tokens 32768 \\
    --cuda-graph-bs-decode 1 2 4 6 8 \\
    --enable-dp-lm-head \\
    --enable-dp-attention --dp-size 4 \\
    --moe-a2a-backend deepep \\
    --deepep-mode auto \\
    --reasoning-parser deepseek-v4 \\
    --speculative-algorithm DSPARK \\
    --speculative-draft-attention-backend ascend \\
    --speculative-num-draft-tokens 7 \\
    --speculative-dspark-block-size 6
```

#### 精度测试

```Bash
pip install sgl-eval
sgl-eval run gsm8k \\
 --model /workspace/shared\_assets/OssSGLangMeetup/model/DeepSeek-V4-Flash-0731 \\
 --base-url http://127.0.0.1:6688/v1 \\
 --num-examples 10 --max-tokens 2048
```

运行结果

```Plain Text
Run directory: /root/.sgl\_eval/sgl\_eval\_gsm8k\_20261114-132308
gsm8k: 100%|█████████████████████████████████████████████████████████████████████████████████| 10/10 \[00:20<00:00,  2.04s/it, acc=100.00%, truncated=0/10 (0.00%)]
== gsm8k ==
10 examples (single-shot)  |  20.4s  |  50 tok/s  |  1K tokens

\* score                =  100.00%
  stop\_rate            =  100.00%
  truncated\_rate       =  0.00%
  error\_rate           =  0.00%
  avg\_input\_tokens     =  86.7 tokens
  avg\_output\_tokens    =  102.0 tokens
  avg\_thinking\_tokens  =  0.0 tokens

Metrics: /root/.sgl\_eval/sgl\_eval\_gsm8k\_20261114-132308/metrics.json
Predictions: /root/.sgl\_eval/sgl\_eval\_gsm8k\_20261114-132308  (1 jsonl file(s))
```

#### 性能测试

```Bash
python -m sglang.benchmark.serving \\
    --dataset-name generated-shared-prefix \\
    --backend sglang \\
    --host 127.0.0.1 \\
    --port 6688 \\
    --gsp-num-groups 1 \\
    --gsp-prompts-per-group 32 \\
    --gsp-system-prompt-len 115200 \\
    --gsp-question-len 12800 \\
    --gsp-output-len 1000 \\
    --max-concurrency 8 \\
    --num-prompts 32 \\
    --warmup-requests 8 \\
    --request-rate inf \\
    --seed 1
```

完整报告

```Java
============ Serving Benchmark Result ============
Backend:                                 sglang    
Traffic request rate:                    inf       
Max request concurrency:                 8         
Successful requests:                     32        
Benchmark duration (s):                  96.69     
Total input tokens:                      4187102   
Total input text tokens:                 4187102   
Total generated tokens:                  32000     
Total generated tokens (retokenized):    31988     
Request throughput (req/s):              0.33      
Input token throughput (tok/s):          43302.62  
Output token throughput (tok/s):         330.94    
Peak output token throughput (tok/s):    1616.00   
Peak concurrent requests:                12        
Total token throughput (tok/s):          43633.56  
Concurrency:                             7.65      
Accept length:                           6.09      
----------------End-to-End Latency----------------
Mean E2E Latency (ms):                   23109.12  
Median E2E Latency (ms):                 21936.40  
P90 E2E Latency (ms):                    30343.88  
P95 E2E Latency (ms):                    32639.82  
P99 E2E Latency (ms):                    43799.95  
---------------Time to First Token----------------
Mean TTFT (ms):                          5738.50   
Median TTFT (ms):                        4455.00   
P90 TTFT (ms):                           10645.66  
P95 TTFT (ms):                           10653.59  
P99 TTFT (ms):                           11744.50  
-----Time per Output Token (excl. 1st token)------
Mean TPOT (ms):                          17.39     
Median TPOT (ms):                        16.69     
P90 TPOT (ms):                           25.28     
P95 TPOT (ms):                           26.79     
P99 TPOT (ms):                           35.00     
---------------Inter-Token Latency----------------
Mean ITL (ms):                           17.40     
Median ITL (ms):                         5.30      
P90 ITL (ms):                            8.96      
P95 ITL (ms):                            46.28     
P99 ITL (ms):                            335.14    
Max ITL (ms):                            8299.24   
==================================================
```

相对 TPOT ≤ 50ms 配置的改动

|参数|TPOT50 配置|TPOT20 配置|原因|
|-|-|-|-|
|`--max-running-requests`|16|**8**|dp4 后每 rank 2 并发，decode batch 减半，单步时间显著下降|
|`SGLANG\_DEEPEP\_NUM\_MAX\_DISPATCH\_TOKENS\_PER\_RANK`|32|**16**|官方公式：2 × 7 = 14，16 留最小余量；过大时每步 padding 抬高 TPOT|
|`--speculative-num-draft-tokens`|6|**7**|对齐官方 V4-Flash 8P 值，单步多验证 1 个 token，摊薄 TPOT|
|`--speculative-dspark-block-size`|5|**6**|与 draft tokens 配套（block + 1 = draft tokens）|
|`SGLANG\_SCHEDULER\_SKIP\_ALL\_GATHER`|未设|**保持不设/0**|实测本镜像开启后 DSPARK verify 报 `DP CUDA graph replay requires raw per-rank request counts`，不可用|

保持不变的项：`--chunked-prefill-size 32768`、`--max-prefill-tokens 32768`、`--mem-fraction-static 0.72`、`--cuda-graph-bs-decode 1 2 4 6 8`、radix cache 保持开启（**不要加回 \*\*\*\*`--disable-radix-cache`**）。

# Qwen3.8-27B

## 硬件环境

### NPU

```Plain Text
+-------------------------------------------------------------------------------------------------+
| npu-smi 25.7.rc1.10                              Version: 25.7.rc1.10                           |
+--------+------------------+---------------+-----------------------------------------------------+
| NPU ID | Name             | Health        | Power(W)    Temp(C)           Hugepages-Usage(page) |
|        |                  | Bus-Id        | NPU Util(%) Memory-Usage(MB)  HBM-Usage(MB)         |
+========+==================+===============+=====================================================+
| 0      | Ascend950PR      | OK            | 495.0       71                0     / 0             |
|        |                  | 0000:0E:00.0  | 99          0    / 0          110634/ 131072        |
+========+==================+===============+=====================================================+
+---------------------------+---------------+-----------------------------------------------------+
| NPU ID                    | Process id    | Process name             | Process memory(MB)       |
+===========================+===============+=====================================================+
| 0                         | 43465         | sglang                   | 341                     |
| 0                         | 43657         | sglangschedul            | 105085                  |
+===========================+===============+=====================================================+
```

## 部署模型

### 部署命令

```Bash
# ============================================================
# Before running, update the following variable:
#   MODEL\_PATH: path to the model weights directory
# ============================================================

# high performance cpu
echo performance | tee /sys/devices/system/cpu/cpu\*/cpufreq/scaling\_governor
sysctl -w vm.swappiness=0
sysctl -w kernel.numa\_balancing=0
sysctl -w kernel.sched\_migration\_cost\_ns=50000
# bind cpu
export SGLANG\_SET\_CPU\_AFFINITY=1

unset https\_proxy
unset http\_proxy
unset HTTPS\_PROXY
unset HTTP\_PROXY
# cann
source /usr/local/Ascend/ascend-toolkit/set\_env.sh
source /usr/local/Ascend/nnal/atb/set\_env.sh

export ASCEND\_USE\_FIA=1
export STREAMS\_PER\_DEVICE=32
export HCCL\_BUFFSIZE=500
export HCCL\_OP\_EXPANSION\_MODE=AIV
export HCCL\_SOCKET\_IFNAME=lo
export GLOO\_SOCKET\_IFNAME=lo
export SGLANG\_ENABLE\_SPEC\_V2=1
export SGLANG\_ENABLE\_OVERLAP\_PLAN\_STREAM=1

MODEL\_PATH=/workspace/shared\_assets/OssSGLangMeetup/model/Qwen3.8-27B

sglang serve \\
    --model-path ${MODEL\_PATH} \\
    --attention-backend ascend --device npu \\
    --chunked-prefill-size -1 --max-prefill-tokens 16384 \\
    --trust-remote-code \\
    --host 127.0.0.1 --port 6688 \\
    --mem-fraction-static 0.85 \\
    --max-running-requests 64 \\
    --dtype bfloat16 --mamba-ssm-dtype bfloat16 \\
    --enable-multimodal --mm-attention-backend ascend\_attn \\
    --speculative-algorithm NEXTN --speculative-num-steps 3 --speculative-eagle-topk 1 --speculative-num-draft-tokens 4 \\
    --dp-size 1 --enable-dp-attention --enable-dp-lm-head \\
    --cuda-graph-bs-decode 8 12 16 20 24 32
```

### 对话测试

```C++
curl http://127.0.0.1:6688/v1/chat/completions \\
    -H "Content-Type: application/json" \\
    -d '{
        "model": "deepseek-v4-flash",
        "messages": \[{"role": "user", "content": "简单讲述一下华为昇腾950PR这个算力?"}]
    }'
```

### 精度测试

```Plain Text
evalscope eval \\
 --model /workspace/shared\_assets/OssSGLangMeetup/model/Qwen3.8-27B \\
 --api-url http://localhost:6688/v1 \\
 --api-key EMPTY \\
 --eval-type openai\_api \\
 --datasets gsm8k \\
 --limit 200
```

测试结果

```Bash
gsm8k report table:
┌─────────────┬───────────┬────────────┬──────────┬───────┬───────────┬─────────┐
│ Model       │ Dataset   │ Metric     │ Subset   │   Num │   Correct │ Score   │
├─────────────┼───────────┼────────────┼──────────┼───────┼───────────┼─────────┤
│ Qwen3.8-27B │ GSM8K     │ Accuracy ↑ │ main     │   200 │       197 │ 98.5%   │
└─────────────┴───────────┴────────────┴──────────┴───────┴───────────┴─────────┘ 

2026-11-17 23:21:06 - evalscope - INFO: Skipping report analysis (`analysis\_report=False`).                                                                      
2026-11-17 23:21:06 - evalscope - INFO: Dump report to: ./outputs/20261117\_231350/reports/Qwen3.8-27B/gsm8k.json                                                 

2026-11-17 23:21:06 - evalscope - INFO:                                                                                                                          
gsm8k perf table:
Model        Dataset      Num  Avg Lat    Avg TTFT    Avg TPOT    Avg Thpt       Avg In    Avg Out
-----------  ---------  -----  ---------  ----------  ----------  -----------  --------  ---------
Qwen3.8-27B  GSM8K        200  11.549 s   —           —           53.37 tok/s       729        616

2026-11-17 23:21:06 - evalscope - INFO: Benchmark gsm8k evaluation finished.                                                                                     
2026-11-17 23:21:06 - evalscope - INFO: Running\[eval] 100%| 1/1 \[Elapsed: 07:15 < Remaining: 00:00, 435.97s/benchmark]                                           
Running\[eval]: 100%|███████████████████████████████████████████████████████████████████████████████████████████████████████| 1/1 \[07:15<00:00, 435.97s/benchmark]
2026-11-17 23:21:06 - evalscope - INFO: Overall report table: 
┌─────────────┬───────────┬────────────┬──────────┬───────┬───────────┬─────────┐
│ Model       │ Dataset   │ Metric     │ Subset   │   Num │   Correct │ Score   │
├─────────────┼───────────┼────────────┼──────────┼───────┼───────────┼─────────┤
│ Qwen3.8-27B │ GSM8K     │ Accuracy ↑ │ main     │   200 │       197 │ 98.5%   │
└─────────────┴───────────┴────────────┴──────────┴───────┴───────────┴─────────┘ 

2026-11-17 23:21:06 - evalscope - INFO: Overall perf table: 
Model        Dataset      Num  Avg Lat    Avg TTFT    Avg TPOT    Avg Thpt       Avg In    Avg Out
-----------  ---------  -----  ---------  ----------  ----------  -----------  --------  ---------
Qwen3.8-27B  GSM8K        200  11.549 s   —           —           53.37 tok/s       729        616 

2026-11-17 23:21:07 - evalscope - INFO: HTML report generated: /workspace/outputs/20261117\_231350/reports/report.html
2026-11-17 23:21:07 - evalscope - INFO: Finished evaluation for Qwen3.8-27B on \['gsm8k']
2026-11-17 23:21:07 - evalscope - INFO: Output directory: ./outputs/20261117\_231350
```

## TPOT<=50ms

### 部署命令

```Bash
# ============================================================
# Before running, update the following variables:
#   MODEL\_PATH: path to the model weights directory
# ============================================================

MODEL\_PATH=/workspace/shared\_assets/OssSGLangMeetup/model/Qwen3.8-27B
echo performance | tee /sys/devices/system/cpu/cpu\*/cpufreq/scaling\_governor
sysctl -w vm.swappiness=0
sysctl -w kernel.numa\_balancing=0
sysctl -w kernel.sched\_migration\_cost\_ns=50000

unset https\_proxy
unset http\_proxy
unset HTTPS\_PROXY
unset HTTP\_PROXY
unset ASCEND\_LAUNCH\_BLOCKING

source /usr/local/Ascend/ascend-toolkit/set\_env.sh
source /usr/local/Ascend/nnal/atb/set\_env.sh

export ASCEND\_USE\_FIA=1
export GDN\_ATTN\_BACKEND\_TRITON=1
export GLOO\_SOCKET\_IFNAME=lo
export HCCL\_OP\_EXPANSION\_MODE=AIV
export HCCL\_SOCKET\_IFNAME=lo
export PYTORCH\_NPU\_ALLOC\_CONF=expandable\_segments:True
export SGLANG\_ENABLE\_OVERLAP\_PLAN\_STREAM=1
export SGLANG\_ENABLE\_SPEC\_V2=1
export SGLANG\_SET\_CPU\_AFFINITY=1
export STREAMS\_PER\_DEVICE=32

python3 -m sglang.launch\_server \\
    --model-path $MODEL\_PATH \\
    --host 127.0.0.1 --port 6688 \\
    --nnodes 1 \\
    --attention-backend ascend \\
    --device npu \\
    --chunked-prefill-size 32768 \\
    --max-prefill-tokens 32768 \\
    --mamba-radix-cache-strategy extra\_buffer \\
    --trust-remote-code \\
    --max-running-requests 20 \\
    --max-mamba-cache-size 160 \\
    --mem-fraction-static 0.82 \\
    --cuda-graph-bs-decode 1 2 5 10 15 17 19 20 \\
    --dtype bfloat16 \\
    --mamba-ssm-dtype bfloat16 \\
    --speculative-algorithm NEXTN \\
    --speculative-num-steps 3 \\
    --speculative-eagle-topk 1 \\
    --speculative-num-draft-tokens 4 \\
    --reasoning-parser qwen3 \\
    --tool-call-parser qwen3\_coder
```

### 性能测试

```Bash
python3 -m sglang.benchmark.serving \\
    --dataset-name generated-shared-prefix \\
    --backend sglang \\
    --host 127.0.0.1 \\
    --port 6688 \\
    --gsp-num-groups 1 \\
    --gsp-prompts-per-group 20 \\
    --gsp-system-prompt-len 57600 \\
    --gsp-question-len 6400 \\
    --gsp-output-len 1000 \\
    --max-concurrency 20 \\
    --num-prompts 20 \\
    --request-rate inf
```

测试结果

```Java
============ Serving Benchmark Result ============
Backend:                                 sglang    
Traffic request rate:                    inf       
Max request concurrency:                 20        
Successful requests:                     20        
Benchmark duration (s):                  44.63     
Total input tokens:                      1313724   
Total input text tokens:                 1313724   
Total generated tokens:                  20000     
Total generated tokens (retokenized):    17847     
Request throughput (req/s):              0.45      
Input token throughput (tok/s):          29437.58  
Output token throughput (tok/s):         448.15    
Peak output token throughput (tok/s):    730.00    
Peak concurrent requests:                20        
Total token throughput (tok/s):          29885.74  
Concurrency:                             14.37     
Accept length:                           3.58      
----------------End-to-End Latency----------------
Mean E2E Latency (ms):                   32065.47  
Median E2E Latency (ms):                 29700.70  
P90 E2E Latency (ms):                    38510.33  
P95 E2E Latency (ms):                    39201.69  
P99 E2E Latency (ms):                    43520.52  
---------------Time to First Token----------------
Mean TTFT (ms):                          3842.06   
Median TTFT (ms):                        4013.51   
P90 TTFT (ms):                           4027.61   
P95 TTFT (ms):                           4029.99   
P99 TTFT (ms):                           4031.00   
-----Time per Output Token (excl. 1st token)------
Mean TPOT (ms):                          28.25     
Median TPOT (ms):                        25.76     
P90 TPOT (ms):                           34.54     
P95 TPOT (ms):                           35.37     
P99 TPOT (ms):                           39.57     
---------------Inter-Token Latency----------------
Mean ITL (ms):                           28.28     
Median ITL (ms):                         24.96     
P90 ITL (ms):                            33.07     
P95 ITL (ms):                            50.02     
P99 ITL (ms):                            99.83     
Max ITL (ms):                            1400.94   
==================================================
```

## W8A8

## 部署命令

```Bash
# ============================================================
# Before running, update the following variable:
#   MODEL\_PATH: path to the model weights directory
# ============================================================

# high performance cpu
echo performance | tee /sys/devices/system/cpu/cpu\*/cpufreq/scaling\_governor
sysctl -w vm.swappiness=0
sysctl -w kernel.numa\_balancing=0
sysctl -w kernel.sched\_migration\_cost\_ns=50000

export SGLANG\_SET\_CPU\_AFFINITY=1

unset https\_proxy
unset http\_proxy
unset HTTPS\_PROXY
unset HTTP\_PROXY
unset ASCEND\_LAUNCH\_BLOCKING

source /usr/local/Ascend/ascend-toolkit/set\_env.sh
source /usr/local/Ascend/nnal/atb/set\_env.sh

export ASCEND\_USE\_FIA=1
export GDN\_ATTN\_BACKEND\_TRITON=1
export STREAMS\_PER\_DEVICE=32
export HCCL\_BUFFSIZE=500
export HCCL\_OP\_EXPANSION\_MODE=AIV
export HCCL\_SOCKET\_IFNAME=lo
export GLOO\_SOCKET\_IFNAME=lo
export PYTORCH\_NPU\_ALLOC\_CONF=expandable\_segments:True
export SGLANG\_ENABLE\_SPEC\_V2=1
export SGLANG\_ENABLE\_OVERLAP\_PLAN\_STREAM=1
export SGLANG\_PREFILL\_DELAYER\_MAX\_DELAY\_PASSES=20
export SGLANG\_SCHEDULER\_DECREASE\_PREFILL\_IDLE=1

MODEL\_PATH=/workspace/shared\_assets/OssSGLangMeetup/model/Qwen3.8-27B-w8a8

sglang serve \\
    --model-path ${MODEL\_PATH} \\
    --attention-backend ascend --device npu \\
    --tp-size 1 \\
    --chunked-prefill-size 32768 --max-prefill-tokens 32768 \\
    --trust-remote-code \\
    --host 127.0.0.1 --port 6688 \\
    --mem-fraction-static 0.8 \\
    --max-running-requests 20 \\
    --max-mamba-cache-size 160 \\
    --mamba-radix-cache-strategy extra\_buffer \\
    --dtype bfloat16 --mamba-ssm-dtype bfloat16 \\
    --enable-multimodal --mm-attention-backend ascend\_attn \\
    --speculative-algorithm NEXTN --speculative-num-steps 3 --speculative-eagle-topk 1 --speculative-num-draft-tokens 4 \\
    --cuda-graph-bs-decode 1 2 5 10 15 17 19 20 \\
    --quantization modelslim
```

### 对话测试

```C++
curl http://127.0.0.1:6688/v1/chat/completions \\
    -H "Content-Type: application/json" \\
    -d '{
        "model": "deepseek-v4-flash",
        "messages": \[{"role": "user", "content": "简单讲述一下华为昇腾950PR这个算力?"}]
    }'
```

### 精度测试

```Plain Text
evalscope eval \\
 --model /workspace/shared\_assets/OssSGLangMeetup/model/Qwen3.8-27B-w8a8 \\
 --api-url http://localhost:6688/v1 \\
 --api-key EMPTY \\
 --eval-type openai\_api \\
 --datasets gsm8k \\
 --limit 200
```

测试结果

```SQL
gsm8k report table:
┌──────────────────┬───────────┬────────────┬──────────┬───────┬───────────┬─────────┐
│ Model            │ Dataset   │ Metric     │ Subset   │   Num │   Correct │ Score   │
├──────────────────┼───────────┼────────────┼──────────┼───────┼───────────┼─────────┤
│ Qwen3.8-27B-w8a8 │ GSM8K     │ Accuracy ↑ │ main     │   200 │       196 │ 98%     │
└──────────────────┴───────────┴────────────┴──────────┴───────┴───────────┴─────────┘ 

2026-11-18 00:58:54 - evalscope - INFO: Skipping report analysis (`analysis\_report=False`).                                                                      
2026-11-18 00:58:54 - evalscope - INFO: Dump report to: ./outputs/20261118\_005025/reports/Qwen3.8-27B-w8a8/gsm8k.json                                            

2026-11-18 00:58:54 - evalscope - INFO:                                                                                                                          
gsm8k perf table:
Model             Dataset      Num  Avg Lat    Avg TTFT    Avg TPOT    Avg Thpt       Avg In    Avg Out
----------------  ---------  -----  ---------  ----------  ----------  -----------  --------  ---------
Qwen3.8-27B-w8a8  GSM8K        200  15.21 s    —           —           37.15 tok/s       729        565

2026-11-18 00:58:54 - evalscope - INFO: Benchmark gsm8k evaluation finished.                                                                                     
2026-11-18 00:58:54 - evalscope - INFO: Running\[eval] 100%| 1/1 \[Elapsed: 08:28 < Remaining: 00:00, 508.43s/benchmark]                                           
Running\[eval]: 100%|███████████████████████████████████████████████████████████████████████████████████████████████████████| 1/1 \[08:28<00:00, 508.43s/benchmark]
2026-11-18 00:58:54 - evalscope - INFO: Overall report table: 
┌──────────────────┬───────────┬────────────┬──────────┬───────┬───────────┬─────────┐
│ Model            │ Dataset   │ Metric     │ Subset   │   Num │   Correct │ Score   │
├──────────────────┼───────────┼────────────┼──────────┼───────┼───────────┼─────────┤
│ Qwen3.8-27B-w8a8 │ GSM8K     │ Accuracy ↑ │ main     │   200 │       196 │ 98%     │
└──────────────────┴───────────┴────────────┴──────────┴───────┴───────────┴─────────┘ 

2026-11-18 00:58:54 - evalscope - INFO: Overall perf table: 
Model             Dataset      Num  Avg Lat    Avg TTFT    Avg TPOT    Avg Thpt       Avg In    Avg Out
----------------  ---------  -----  ---------  ----------  ----------  -----------  --------  ---------
Qwen3.8-27B-w8a8  GSM8K        200  15.21 s    —           —           37.15 tok/s       729        565 

2026-11-18 00:58:54 - evalscope - INFO: HTML report generated: /workspace/work\_dir/outputs/20261118\_005025/reports/report.html
2026-11-18 00:58:55 - evalscope - INFO: Finished evaluation for Qwen3.8-27B-w8a8 on \['gsm8k']
2026-11-18 00:58:55 - evalscope - INFO: Output directory: ./outputs/20261118\_005025
```

## W8A8\_TPOT<=50ms

### 部署命令

```Bash
echo performance | tee /sys/devices/system/cpu/cpu\*/cpufreq/scaling\_governor
sysctl -w vm.swappiness=0
sysctl -w kernel.numa\_balancing=0
sysctl -w kernel.sched\_migration\_cost\_ns=50000

export SGLANG\_SET\_CPU\_AFFINITY=1

unset https\_proxy http\_proxy HTTPS\_PROXY HTTP\_PROXY ASCEND\_LAUNCH\_BLOCKING

source /usr/local/Ascend/ascend-toolkit/set\_env.sh
source /usr/local/Ascend/nnal/atb/set\_env.sh

export ASCEND\_USE\_FIA=1
export GDN\_ATTN\_BACKEND\_TRITON=1
export STREAMS\_PER\_DEVICE=32
export HCCL\_BUFFSIZE=500
export HCCL\_OP\_EXPANSION\_MODE=AIV
export HCCL\_SOCKET\_IFNAME=lo
export GLOO\_SOCKET\_IFNAME=lo
export PYTORCH\_NPU\_ALLOC\_CONF=expandable\_segments:True

MODEL\_PATH=/workspace/shared\_assets/OssSGLangMeetup/model/Qwen3.8-27B-w8a8

sglang serve \\
    --model-path ${MODEL\_PATH} \\
    --attention-backend ascend --device npu \\
    --tp-size 1 \\
    --chunked-prefill-size 8192 --max-prefill-tokens 16384 \\
    --trust-remote-code \\
    --host 127.0.0.1 --port 6688 \\
    --mem-fraction-static 0.82 \\
    --max-running-requests 16 \\
    --max-mamba-cache-size 160 \\
    --mamba-radix-cache-strategy extra\_buffer \\
    --enable-prefill-delayer \\
    --prefill-delayer-max-delay-passes 50 \\
    --dtype bfloat16 --mamba-ssm-dtype bfloat16 \\
    --enable-multimodal --mm-attention-backend ascend\_attn \\
    --cuda-graph-bs-decode 1 2 4 6 8 10 12 14 16 \\
    --cuda-graph-max-bs-decode 16 \\
    --quantization modelslim
```

### 性能测试

```Bash
python3 -m sglang.benchmark.serving \\
    --dataset-name generated-shared-prefix \\
    --backend sglang \\
    --host 127.0.0.1 \\
    --port 6688 \\
    --gsp-num-groups 1 \\
    --gsp-prompts-per-group 20 \\
    --gsp-system-prompt-len 57600 \\
    --gsp-question-len 6400 \\
    --gsp-output-len 1000 \\
    --max-concurrency 20 \\
    --num-prompts 20 \\
    --request-rate inf
```

测试结果

```Java
============ Serving Benchmark Result ============
Backend:                                 sglang    
Traffic request rate:                    inf       
Max request concurrency:                 20        
Successful requests:                     20        
Benchmark duration (s):                  144.67    
Total input tokens:                      1313724   
Total input text tokens:                 1313724   
Total generated tokens:                  20000     
Total generated tokens (retokenized):    17603     
Request throughput (req/s):              0.14      
Input token throughput (tok/s):          9080.67   
Output token throughput (tok/s):         138.24    
Peak output token throughput (tok/s):    256.00    
Peak concurrent requests:                20        
Total token throughput (tok/s):          9218.91   
Concurrency:                             15.03     
----------------End-to-End Latency----------------
Mean E2E Latency (ms):                   108701.81 
Median E2E Latency (ms):                 99253.47  
P90 E2E Latency (ms):                    144532.27 
P95 E2E Latency (ms):                    144534.41 
P99 E2E Latency (ms):                    144551.46 
---------------Time to First Token----------------
Mean TTFT (ms):                          39133.48  
Median TTFT (ms):                        27979.84  
P90 TTFT (ms):                           104914.98 
P95 TTFT (ms):                           106676.88 
P99 TTFT (ms):                           106686.60 
-----Time per Output Token (excl. 1st token)------
Mean TPOT (ms):                          69.64     
Median TPOT (ms):                        71.34     
P90 TPOT (ms):                           89.15     
P95 TPOT (ms):                           95.21     
P99 TPOT (ms):                           96.36     
---------------Inter-Token Latency----------------
Mean ITL (ms):                           69.67     
Median ITL (ms):                         67.71     
P90 ITL (ms):                            73.64     
P95 ITL (ms):                            74.59     
P99 ITL (ms):                            76.27     
Max ITL (ms):                            25428.81  
==================================================
```

